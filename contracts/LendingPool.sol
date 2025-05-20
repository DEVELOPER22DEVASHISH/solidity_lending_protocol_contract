// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./InterestRateModel.sol";
import "./CollateralManager.sol";
import "./LendingLogic.sol";
import "./ReserveConfiguration.sol";
import "./Errors.sol";

// interfaces for asset-specific LToken and DebtToken

interface ILToken {
    function mint(address to, uint256 amount) external;

    function burn(address from, uint256 amount) external;
}

interface IDebtToken {
    function mint(address to, uint256 amount) external;

    function burn(address from, uint256 amount) external;
}

contract LendingPool is AccessControl, ReentrancyGuard, Pausable {
    using LendingLogic for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant LIQUIDATOR_ROLE = keccak256("LIQUIDATOR_ROLE");

    struct ReserveData {
        address lToken;
        address debtToken;
        uint256 totalDeposits;
        uint256 totalBorrows;
        uint256 lastUpdateTimestamp;
        bool isInitialized;
    }

    mapping(address => ReserveData) public reserves; // asset => data
    InterestRateModel public interestModel;
    CollateralManager public collateralManager;
    ReserveConfiguration public reserveConfig;
    mapping(address => mapping(address => uint256)) public userLastInterest;

    event Deposit(address indexed user, address indexed asset, uint256 amount);
    event Withdraw(address indexed user, address indexed asset, uint256 amount);
    event Borrow(address indexed user, address indexed asset, uint256 amount);
    event Repay(address indexed user, address indexed asset, uint256 amount);
    event Liquidation(
        address indexed liquidator,
        address indexed user,
        address collateralAsset,
        address debtAsset,
        uint256 repayAmount,
        uint256 seizeAmount
    );

    constructor(
        address _interestModel,
        address _collateralManager,
        address _reserveConfig
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        interestModel = InterestRateModel(_interestModel);
        collateralManager = CollateralManager(_collateralManager);
        reserveConfig = ReserveConfiguration(_reserveConfig);
    }

    modifier onlyInitialized(address asset) {
        if (!reserves[asset].isInitialized) {
            revert Errors.ReserveNotInitialized();
        }
        _;
    }

    function initReserve(
        address asset,
        address lToken,
        address debtToken
    ) external onlyRole(ADMIN_ROLE) {
        if (reserves[asset].isInitialized) {
            revert Errors.ReserveAlreadyInitialized();
        }
        reserves[asset] = ReserveData({
            lToken: lToken,
            debtToken: debtToken,
            totalDeposits: 0,
            totalBorrows: 0,
            lastUpdateTimestamp: block.timestamp,
            isInitialized: true
        });
    }

    function deposit(
        address asset,
        uint256 amount
    ) external nonReentrant whenNotPaused onlyInitialized(asset) {
        if (!reserveConfig.getConfig(asset).isActive) {
            revert Errors.ReserveNotActive();
        }

        _accrueInterest(asset);

        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        ILToken(reserves[asset].lToken).mint(msg.sender, amount);
        reserves[asset].totalDeposits += amount;

        emit Deposit(msg.sender, asset, amount);
    }

    function withdraw(
        address asset,
        uint256 amount
    ) external nonReentrant whenNotPaused onlyInitialized(asset) {
        _accrueInterest(asset);

        ILToken(reserves[asset].lToken).burn(msg.sender, amount);
        reserves[asset].totalDeposits -= amount;

        IERC20(asset).transfer(msg.sender, amount);
        emit Withdraw(msg.sender, asset, amount);
    }

    function borrow(
        address asset,
        uint256 amount,
        address collateralAsset,
        uint256 collateralAmount
    ) external nonReentrant whenNotPaused onlyInitialized(asset) {
        if (!reserveConfig.getConfig(asset).isActive) {
            revert Errors.ReserveNotActive();
        }

        if (
            !collateralManager.isHealthy(
                msg.sender,
                collateralAsset,
                collateralAmount,
                asset,
                amount
            )
        ) {
            revert Errors.NotEnoughCollateral();
        }

        _accrueInterest(asset);

        IDebtToken(reserves[asset].debtToken).mint(msg.sender, amount);
        reserves[asset].totalBorrows += amount;

        IERC20(asset).transfer(msg.sender, amount);
        emit Borrow(msg.sender, asset, amount);
    }

    function repay(
        address asset,
        uint256 amount
    ) external nonReentrant whenNotPaused onlyInitialized(asset) {
        _accrueInterest(asset);

        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        IDebtToken(reserves[asset].debtToken).burn(msg.sender, amount);
        reserves[asset].totalBorrows -= amount;

        emit Repay(msg.sender, asset, amount);
    }

    function liquidate(
        address user,
        address collateralAsset,
        address debtAsset,
        uint256 repayAmount
    ) external nonReentrant onlyRole(LIQUIDATOR_ROLE) {
        if (
            !collateralManager.isLiquidatable(
                user,
                collateralAsset,
                IERC20(collateralAsset).balanceOf(user),
                debtAsset,
                repayAmount
            )
        ) {
            revert Errors.CannotLiquidateHealthyPosition();
        }

        _accrueInterest(debtAsset);

        IERC20(debtAsset).transferFrom(msg.sender, address(this), repayAmount);

        IDebtToken(reserves[debtAsset].debtToken).burn(user, repayAmount);
        reserves[debtAsset].totalBorrows -= repayAmount;

        uint256 priceDebt = collateralManager.oracle().getPrice(debtAsset);
        uint256 priceColl = collateralManager.oracle().getPrice(
            collateralAsset
        );

        uint256 seizeAmount = ((repayAmount * priceDebt * 110) / 100) /
            priceColl;

        ILToken(reserves[collateralAsset].lToken).burn(user, seizeAmount);
        ILToken(reserves[collateralAsset].lToken).mint(msg.sender, seizeAmount);

        emit Liquidation(
            msg.sender,
            user,
            collateralAsset,
            debtAsset,
            repayAmount,
            seizeAmount
        );
    }

    function _accrueInterest(address asset) internal {
        ReserveData storage reserve = reserves[asset];
        uint256 timeDiff = block.timestamp - reserve.lastUpdateTimestamp;
        if (timeDiff == 0 || reserve.totalBorrows == 0) return;

        uint256 utilization = reserve.totalBorrows.calculateUtilization(
            reserve.totalDeposits
        );
        uint256 ratePerSecond = interestModel.getBorrowRate(utilization);
        uint256 interest = (reserve.totalBorrows * ratePerSecond * timeDiff) /
            1e18;

        reserve.totalBorrows += interest;
        reserve.lastUpdateTimestamp = block.timestamp;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function setReserveTokens(
        address asset,
        address lToken,
        address debtToken
    ) external onlyRole(ADMIN_ROLE) {
        if (!reserves[asset].isInitialized) {
            revert Errors.ReserveNotInitialized();
        }

        reserves[asset].lToken = lToken;
        reserves[asset].debtToken = debtToken;
    }

    function setReserveLToken(
        address asset,
        address newLToken
    ) external onlyRole(ADMIN_ROLE) {
        if (!reserves[asset].isInitialized) {
            revert Errors.ReserveNotInitialized();
        }

        reserves[asset].lToken = newLToken;
    }

    function setReserveDebtToken(
        address asset,
        address newDebtToken
    ) external onlyRole(ADMIN_ROLE) {
        if (!reserves[asset].isInitialized) {
            revert Errors.ReserveNotInitialized();
        }

        reserves[asset].debtToken = newDebtToken;
    }
}
