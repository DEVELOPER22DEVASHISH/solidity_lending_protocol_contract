// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./LToken.sol";
import "./DebtToken.sol";
import "./InterestRateModel.sol";
import "./CollateralManager.sol";
import "./LendingLogic.sol";
import "./ReserveConfiguration.sol";
import "./Errors.sol";

contract LendingPool is AccessControl, ReentrancyGuard, Pausable {
    using LendingLogic for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant LIQUIDATOR_ROLE = keccak256("LIQUIDATOR_ROLE");

    struct ReserveData {
        LToken lToken;
        DebtToken debtToken;
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
            lToken: LToken(lToken),
            debtToken: DebtToken(debtToken),
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
        reserves[asset].lToken.mint(msg.sender, amount);
        reserves[asset].totalDeposits += amount;

        emit Deposit(msg.sender, asset, amount);
    }

    function withdraw(
        address asset,
        uint256 amount
    ) external nonReentrant whenNotPaused onlyInitialized(asset) {
        _accrueInterest(asset);

        reserves[asset].lToken.burn(msg.sender, amount);
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

        reserves[asset].debtToken.mint(msg.sender, amount);
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
        reserves[asset].debtToken.burn(msg.sender, amount);
        reserves[asset].totalBorrows -= amount;

        emit Repay(msg.sender, asset, amount);
    }

    function liquidate(
        address user,
        address collateralAsset,
        address debtAsset,
        uint256 repayAmount
    ) external nonReentrant onlyRole(LIQUIDATOR_ROLE) {
        // Check if the position is liquidatable using the updated function
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

        // Transfer repayAmount from liquidator to pool
        IERC20(debtAsset).transferFrom(msg.sender, address(this), repayAmount);

        // Burn debt from user
        reserves[debtAsset].debtToken.burn(user, repayAmount);
        reserves[debtAsset].totalBorrows -= repayAmount;

        // Seize collateral (applying 10% liquidation bonus)
        uint256 priceDebt = collateralManager.oracle().getPrice(debtAsset);
        uint256 priceColl = collateralManager.oracle().getPrice(
            collateralAsset
        );

        // Liquidation formula: seizeAmount = repayAmount * (1 + liquidation bonus) * priceDebt / priceColl
        uint256 seizeAmount = ((repayAmount * priceDebt * 110) / 100) /
            priceColl;

        // Burn collateral from user
        reserves[collateralAsset].lToken.burn(user, seizeAmount);

        // Mint collateral to liquidator
        reserves[collateralAsset].lToken.mint(msg.sender, seizeAmount);

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
        uint256 ratePerSecond = interestModel.getInterestRate(
            asset,
            utilization
        );
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
}
