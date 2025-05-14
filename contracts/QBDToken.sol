// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// QBDToken is an ERC20 token contract that represents a governance token in the decentralized ecosystem. // as oof now keeping this optional
// The token can be minted by authorized addresses only, ensuring controlled token supply.
contract QBDToken is ERC20, AccessControl {
    // Role identifiers for access control
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Constructor that sets the token name and symbol and assigns roles to the deployer
    constructor() ERC20("QBD Token", "QBD") {
        // Grant the deployer both the admin and minter roles
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    // Modifier to ensure that only an account with MINTER_ROLE can call the mint function
    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "QBDToken: caller is not a minter");
        _;
    }

    // Modifier to ensure that only an account with ADMIN_ROLE can manage roles
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "QBDToken: caller is not an admin");
        _;
    }

    // Function to mint new tokens, only callable by accounts with MINTER_ROLE
    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }

    // Function to add a new minter role, only callable by accounts with ADMIN_ROLE
    function addMinter(address account) external onlyAdmin {
        grantRole(MINTER_ROLE, account);
    }

    // Function to remove a minter role, only callable by accounts with ADMIN_ROLE
    function removeMinter(address account) external onlyAdmin {
        revokeRole(MINTER_ROLE, account);
    }

    // Function to add an admin role, only callable by accounts with ADMIN_ROLE
    function addAdmin(address account) external onlyAdmin {
        grantRole(ADMIN_ROLE, account);
    }

    // Function to remove an admin role, only callable by accounts with ADMIN_ROLE
    function removeAdmin(address account) external onlyAdmin {
        revokeRole(ADMIN_ROLE, account);
    }
}
