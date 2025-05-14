// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol"; // Use Ownable for ownership control

/**
 * @title PriceOracle
 * @dev This contract serves as a simple on-chain price oracle for assets.
 * It allows the contract owner to set and update asset prices, which are then used by
 * lending pool contracts (e.g., for determining collateral values, health factors, liquidation thresholds).
 *
 * Prices are stored in 1e8 format to support decimal values (e.g., $1.23 = 123_000_000).
 * In production, this contract would typically be replaced or upgraded with a secure oracle
 * like Chainlink or a trusted off-chain feeder mechanism.
 */

contract PriceOracle is Ownable {
    mapping(address => uint256) public prices; // asset => price in USD (1e8)

    // Event to log price updates
    event PriceUpdated(address indexed asset, uint256 newPrice);

    // Set price for an asset, only callable by the owner
    function setPrice(address asset, uint256 price) external onlyOwner {
        require(price > 0, "Price must be greater than zero");
        prices[asset] = price;

        emit PriceUpdated(asset, price); // Emit event on price update
    }

    // Get the price of an asset
    function getPrice(address asset) external view returns (uint256) {
        return prices[asset];
    }
}
