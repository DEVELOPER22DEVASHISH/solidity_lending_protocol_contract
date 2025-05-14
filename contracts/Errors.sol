// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Errors
/// @notice Centralized custom errors for gas-efficient error handling across the lending protocol.
library Errors {
    // --- Access Control ---
    error Unauthorized(); // Caller does not have required role

    // --- Lending Pool / Reserve Management ---
    error ReserveNotInitialized(); // Called on an asset that has not been added to the reserve
    error ReserveAlreadyInitialized(); // Trying to add a reserve that already exists
    error ReserveNotActive(); // Reserve is not active for lending/borrowing
    error InvalidReserveAddress(); // Provided reserve address is zero or invalid

    // --- Asset / Token Transfers ---
    error TransferFailed(); // Asset transfer failed (e.g., ERC20 transferFrom returned false)
    error MintFailed(); // Token minting failed
    error BurnFailed(); // Token burning failed

    // --- Collateral / Borrowing Logic ---
    error NotEnoughCollateral(); // Borrower does not have enough collateral
    error InvalidBorrowAmount(); // Borrow amount is zero or exceeds available liquidity
    error BorrowCapExceeded(); // Trying to borrow more than cap

    // --- Repay / Withdraw / Liquidation ---
    error RepayAmountTooHigh(); // Repay amount exceeds debt
    error InvalidWithdrawAmount(); // Withdraw amount exceeds balance or liquidity
    error CannotLiquidateHealthyPosition(); // Trying to liquidate a position that's not undercollateralized

    // --- Token Validation ---
    error ZeroAddress(); // Provided address is zero
    error InvalidToken(); // Token address is not valid or not supported
    error TokenMismatch(); // Token addresses do not match expected value

    // --- Administrative ---
    error Paused(); // Contract is currently paused
    error AlreadyPaused(); // Trying to pause when already paused
    error NotPaused(); // Trying to unpause when not paused

    // --- Internal ---
    error InvalidOperation(); // Generic invalid state
    error ReentrancyGuard(); // Reentrant call detected
}
