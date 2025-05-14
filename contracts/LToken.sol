// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// interest bearing token
contract LToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor() ERC20("Lending Token", "dUSDC") {
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "LToken: caller is not a minter");
        _;
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "LToken: caller is not an admin");
        _;
    }

    // Function to mint tokens, only callable by accounts with MINTER_ROLE
    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }

    // Function to burn tokens, only callable by accounts with MINTER_ROLE
    function burn(address from, uint256 amount) external onlyMinter {
        _burn(from, amount);
    }

    // Function to add a new minter role, only callable by ADMIN_ROLE
    function addMinter(address account) external onlyAdmin {
        grantRole(MINTER_ROLE, account);
    }

    // Function to remove a minter role, only callable by ADMIN_ROLE
    function removeMinter(address account) external onlyAdmin {
        revokeRole(MINTER_ROLE, account);
    }

    // Function to add an admin role, only callable by ADMIN_ROLE
    function addAdmin(address account) external onlyAdmin {
        grantRole(ADMIN_ROLE, account);
    }

    // Function to remove an admin role, only callable by ADMIN_ROLE
    function removeAdmin(address account) external onlyAdmin {
        revokeRole(ADMIN_ROLE, account);
    }
}
