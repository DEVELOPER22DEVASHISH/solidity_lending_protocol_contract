// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title LendingLogic
/// @dev Library to perform core lending calculations like utilization ratio
library LendingLogic {
    /**
     * @notice Calculates the utilization rate of the lending pool
     * @param totalBorrows Total amount borrowed from the pool
     * @param totalDeposits Total supplied liquidity in the pool
     * @return utilization Utilization rate scaled to 1e18
     */
    function calculateUtilization(uint256 totalBorrows, uint256 totalDeposits) internal pure returns (uint256) {
        // Avoid division by zero
        if (totalDeposits == 0) return 0;

        // Utilization = totalBorrows / totalDeposits
        return (totalBorrows * 1e18) / totalDeposits;
    }
}
