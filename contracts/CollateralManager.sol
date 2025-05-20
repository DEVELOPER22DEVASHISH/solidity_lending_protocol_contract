// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ReserveConfiguration.sol";
import "./PriceOracle.sol";

/**
 * @title CollateralManager
 * @dev Evaluates collateral health and risk for liquidation.
 * - Uses asset prices from PriceOracle
 * - Uses asset risk config (LTV, liquidationThreshold) from ReserveConfiguration
 */
contract CollateralManager {
    ReserveConfiguration public reserveConfig;
    PriceOracle public oracle;

    constructor(address _reserveConfig, address _oracle) {
        require(_reserveConfig != address(0), "Invalid reserve config address");
        require(_oracle != address(0), "Invalid oracle address");

        reserveConfig = ReserveConfiguration(_reserveConfig);
        oracle = PriceOracle(_oracle);
    }

    /**
     * @notice Checks whether the user’s collateral is sufficient for their debt.
     * @param user Address of the borrower (not used now, but reserved for future use)
     * @param collateralAsset Token address of the collateral
     * @param collateralAmount Amount of collateral (in token units)
     * @param debtAsset Token address of the borrowed asset
     * @param debtAmount Amount of debt (in token units)
     * @return True if the user is healthy (i.e., not undercollateralized)
     */
    function isHealthy(
        address user,
        address collateralAsset,
        uint256 collateralAmount,
        address debtAsset,
        uint256 debtAmount
    ) public view returns (bool) {
        // Get current prices
        uint256 collateralPrice = oracle.getPrice(collateralAsset);
        uint256 debtPrice = oracle.getPrice(debtAsset);
        require(collateralPrice > 0 && debtPrice > 0, "Invalid oracle price");

        // Load config for collateral asset
        ReserveConfiguration.Config memory config = reserveConfig.getConfig(
            collateralAsset
        );
        require(config.isActive, "Collateral asset not active");

        // Compute values in USD (1e18 scale)
        uint256 collateralValue = (collateralAmount * collateralPrice) / 1e18;
        uint256 debtValue = (debtAmount * debtPrice) / 1e18;

        // Evaluate whether debt is within LTV limit
        return debtValue <= (collateralValue * config.ltv) / 1e18;
    }

    /**
     * @notice Determines whether a user’s position is eligible for liquidation.
     * @param user Address of the borrower (not used here, but left for consistency/future use)
     * @param collateralAsset Token address of the collateral
     * @param collateralAmount Amount of collateral (in token units)
     * @param debtAsset Token address of the borrowed asset
     * @param debtAmount Amount of debt (in token units)
     * @return True if the position can be liquidated (i.e., debt exceeds liquidation threshold)
     */
    function isLiquidatable(
        address user,
        address collateralAsset,
        uint256 collateralAmount,
        address debtAsset,
        uint256 debtAmount
    ) public view returns (bool) {
        // Get current prices
        uint256 collateralPrice = oracle.getPrice(collateralAsset);
        uint256 debtPrice = oracle.getPrice(debtAsset);
        require(collateralPrice > 0 && debtPrice > 0, "Invalid oracle price");

        // Load config for collateral asset
        ReserveConfiguration.Config memory config = reserveConfig.getConfig(
            collateralAsset
        );
        require(config.isActive, "Collateral asset not active");

        // Compute values in USD (1e18 scale)
        uint256 collateralValue = (collateralAmount * collateralPrice) / 1e18;
        uint256 debtValue = (debtAmount * debtPrice) / 1e18;

        // Evaluate whether the debt exceeds the liquidation threshold
        return
            debtValue > (collateralValue * config.liquidationThreshold) / 1e18;
    }
}

/*
    // === Per-User Risk Configuration (Future Extension) ===
    // In the future,  can allow custom risk parameters (LTV, liquidation threshold, etc.)
    // for specific users (e.g., VIPs, partners) by adding this mapping and logic:

    // mapping(address => ReserveConfiguration.Config) public userRiskConfig;

    // function setUserRiskConfig(address user, ReserveConfiguration.Config calldata config) external onlyRole(ADMIN_ROLE) {
    //     userRiskConfig[user] = config;
    // }

    // function _getConfig(address user, address asset) internal view returns (ReserveConfiguration.Config memory) {
    //     ReserveConfiguration.Config memory config = userRiskConfig[user];
    //     if (config.isActive) {
    //         return config;
    //     }
    //     return reserveConfig.getConfig(asset);
    // }

    // In isHealthy/isLiquidatable, replace:
    // ReserveConfiguration.Config memory config = reserveConfig.getConfig(collateralAsset);
    // with:
    // ReserveConfiguration.Config memory config = _getConfig(user, collateralAsset);
*/

/*
    // === Blacklist/Whitelist (Future Extension) ===
    // To restrict protocol access for certain users, add these mappings and checks:

    // mapping(address => bool) public isBlacklisted;
    // mapping(address => bool) public isWhitelisted;

    // function setBlacklist(address user, bool value) external onlyRole(ADMIN_ROLE) {
    //     isBlacklisted[user] = value;
    // }
    // function setWhitelist(address user, bool value) external onlyRole(ADMIN_ROLE) {
    //     isWhitelisted[user] = value;
    // }

    // In isHealthy/isLiquidatable, add:
    // require(!isBlacklisted[user], "User is blacklisted");
    // // Optionally: require(isWhitelisted[user], "User not whitelisted");
*/

/*
    // === User-Specific Collateral/Debt Tracking (Future Extension) ===
    // To track collateral and debt per user, need to add these mappings:

    // mapping(address => mapping(address => uint256)) public userCollateral; // user => asset => amount
    // mapping(address => mapping(address => uint256)) public userDebt;       // user => asset => amount

    // Update these mappings in your deposit/borrow/repay/withdraw logic.
    // Then, in isHealthy/isLiquidatable,  can fetch:
    // uint256 collateralAmount = userCollateral[user][collateralAsset];
    // uint256 debtAmount = userDebt[user][debtAsset];
*/
