// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./LendingPool.sol";
import "./LToken.sol";
import "./DebtToken.sol";

/**
 * @title LendingConfigurator
 * @dev Admin contract to manage reserve configuration for the LendingPool
 */
contract LendingConfigurator is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Reference to the LendingPool
    LendingPool public lendingPool;

    /**
     * @dev Constructor sets the LendingPool address and grants admin roles
     * @param _lendingPool The address of the LendingPool contract
     */
    constructor(address _lendingPool) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        lendingPool = LendingPool(_lendingPool);
    }

    /**
     * @dev Adds a new reserve to the LendingPool. Can only be called by an admin.
     * @param asset The ERC20 asset address to be supported
     * @param lToken The address of the LToken contract for the asset
     * @param debtToken The address of the DebtToken contract for the asset
     */
    function addReserve(
        address asset,
        address lToken,
        address debtToken
    ) external onlyRole(ADMIN_ROLE) {
        // Initialize reserve with given LToken and DebtToken
        // lendingPool.reserves(asset).lToken = LToken(lToken);
        // lendingPool.reserves(asset).debtToken = DebtToken(debtToken);
        lendingPool.initReserve(asset, lToken, debtToken);
    }

    /**
     * @dev Updates the LToken contract address for an existing reserve
     * @param asset The ERC20 asset whose LToken is being updated
     * @param newLToken The address of the new LToken contract
     * @notice this function will be called first then in LendingPool
     */
    function configureReserveLToken(
        address asset,
        address newLToken
    ) external onlyRole(ADMIN_ROLE) {
        lendingPool.setReserveLToken(asset, newLToken);
    }

    /**
     * @dev Updates the DebtToken contract address for an existing reserve
     * @param asset The ERC20 asset whose DebtToken is being updated
     * @param newDebtToken The address of the new DebtToken contract
     */
    function configureReserveDebtToken(
        address asset,
        address newDebtToken
    ) external onlyRole(ADMIN_ROLE) {
        lendingPool.setReserveDebtToken(asset, newDebtToken);
    }
}
