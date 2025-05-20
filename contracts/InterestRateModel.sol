// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title InterestRateModel
 * @dev This contract defines a dynamic interest rate model for borrowings in a lending protocol.
 * It calculates interest rates based on asset utilization to incentivize balanced lending and borrowing:
 *
 * - When utilization is low, the interest rate increases slowly (slope1).
 * - When utilization exceeds a threshold (optimalUtilization), the rate increases steeply (slope2).
 *
 * This helps ensure:
 * - High capital efficiency
 * - Protection from liquidity risks
 * - Fair pricing for borrowers/lenders
 */
contract InterestRateModel {
    /// @notice Base interest rate (e.g., 1% = 0.01 * 1e18)
    uint256 public baseRate = 1e16; // 1%

    /// @notice Utilization ratio threshold after which slope2 applies (e.g., 80%)
    uint256 public optimalUtilization = 8e17; // 80%

    /// @notice Slope of interest rate curve before optimal utilization
    uint256 public slope1 = 4e16; // 4%

    /// @notice Slope of interest rate curve after optimal utilization
    uint256 public slope2 = 75e16; // 75%

    /**
     * @notice Calculates the borrow interest rate based on current utilization
     * @param utilization The utilization ratio (in 1e18 scale, e.g., 75% = 0.75e18)
     * @return The borrow interest rate (in 1e18 scale, e.g., 0.05e18 = 5%)
     */
    function getBorrowRate(
        uint256 utilization
    ) external view returns (uint256) {
        if (utilization <= optimalUtilization) {
            // Below optimal, use baseRate + slope1 * utilization
            return baseRate + (utilization * slope1) / 1e18;
        } else {
            // Above optimal, use slope2 for excess utilization
            uint256 normalRate = baseRate +
                (optimalUtilization * slope1) /
                1e18;
            uint256 excessUtil = utilization - optimalUtilization;
            return normalRate + (excessUtil * slope2) / 1e18;
        }
    }
}
