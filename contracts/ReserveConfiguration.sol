// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReserveConfiguration
 * @dev Stores configuration parameters for each reserve (asset), including:
 * - Loan-to-Value (LTV)
 * - Liquidation Threshold
 * - Liquidation Bonus
 * - Asset Active/Inactive Status
 *
 * This configuration helps manage risk and collateral rules on a per-asset basis.
 */
contract ReserveConfiguration is Ownable {
    struct Config {
        uint256 ltv; // Max borrow % (e.g. 75% = 0.75e18)
        uint256 liquidationThreshold; // Health factor threshold (e.g. 80%)
        uint256 liquidationBonus; // Bonus % given to liquidators (e.g. 105%)
        bool isActive; // If this asset is enabled in the protocol
    }

    mapping(address => Config) private configs;

    /// @notice Emitted when a reserve config is updated
    event ConfigUpdated(
        address indexed asset,
        uint256 ltv,
        uint256 liquidationThreshold,
        uint256 liquidationBonus,
        bool isActive
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Set risk configuration for a specific asset (owner only).
     */
    function setConfig(
        address asset,
        uint256 ltv,
        uint256 liquidationThreshold,
        uint256 liquidationBonus,
        bool isActive
    ) external onlyOwner {
        require(asset != address(0), "Invalid asset address");
        require(ltv <= 1e18, "LTV > 100%");
        require(liquidationThreshold <= 1e18, "Liquidation threshold > 100%");
        require(liquidationBonus >= 1e18, "Bonus must be >= 100%");

        configs[asset] = Config(
            ltv,
            liquidationThreshold,
            liquidationBonus,
            isActive
        );
        emit ConfigUpdated(
            asset,
            ltv,
            liquidationThreshold,
            liquidationBonus,
            isActive
        );
    }

    /**
     * @dev Get the configuration for a given asset.
     */
    function getConfig(address asset) external view returns (Config memory) {
        return configs[asset];
    }

    /**
     * @dev Returns true if the asset is active (enabled in protocol).
     */
    function isAssetActive(address asset) external view returns (bool) {
        return configs[asset].isActive;
    }
}
