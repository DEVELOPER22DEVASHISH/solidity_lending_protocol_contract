// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

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
    // asset => Chainlink aggregator address
    constructor() Ownable(msg.sender) {}

    mapping(address => address) public aggregators;
    event AggregatorSet(address indexed asset, address indexed aggregator);

    /**
     * @notice Set or update the Chainlink aggregator for an asset (admin only)
     * @param asset The ERC20 token address (e.g., USDC)
     * @param aggregator The Chainlink aggregator contract address for asset/USD
     */
    function setAggregator(
        address asset,
        address aggregator
    ) external onlyOwner {
        require(asset != address(0), "Invalid asset address");
        require(aggregator != address(0), "Invalid aggregator address");
        aggregators[asset] = aggregator;
        emit AggregatorSet(asset, aggregator);
    }

    /**
     * @notice Get the latest price for an asset (in 1e8, like Chainlink USD feeds)
     * @param asset The ERC20 token address (e.g., USDC)
     * @return price The latest price from Chainlink (1e8 decimals)
     */

    function getPrice(address asset) external view returns (uint256 price) {
        address aggregator = aggregators[asset];
        require(aggregator != address(0), "Aggregator not set");

        AggregatorV3Interface priceFeed = AggregatorV3Interface(aggregator);
        (
            ,
            int256 answer,
            ,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        require(answer > 0, "Invalid price");
        require(updatedAt > 0 && answeredInRound > 0, "Stale price feed");

        uint8 decimals = priceFeed.decimals();
        // Normalize to 18 decimals
        price = uint256(answer) * (10 ** (18 - decimals));
        return price;
    }

    /**
     * @notice Get raw Chainlink price for an asset (no normalization)
     * @param asset ERC20 token address
     * @return price Raw Chainlink price with aggregator decimals
     */
    function getRawPrice(address asset) external view returns (int256 price) {
        address aggregator = aggregators[asset];
        require(aggregator != address(0), "Aggregator not set");

        (, int256 answer, , , ) = AggregatorV3Interface(aggregator)
            .latestRoundData();
        require(answer > 0, "Invalid price");

        return answer;
    }

    /**
     * @notice Get decimals of the Chainlink feed for an asset
     * @param asset ERC20 token address
     * @return decimals Number of decimals used in price feed
     */
    function getAggregatorDecimals(
        address asset
    ) external view returns (uint8) {
        address aggregator = aggregators[asset];
        require(aggregator != address(0), "Aggregator not set");

        return AggregatorV3Interface(aggregator).decimals();
    }

    /**
     * @notice Get aggregator address for an asset
     * @param asset ERC20 token address
     * @return aggregator Chainlink aggregator address
     */
    function getAggregator(address asset) external view returns (address) {
        return aggregators[asset];
    }
}

// ----for manual price setting----
//  constructor() Ownable(msg.sender) {}
// mapping(address => uint256) public prices; // asset => price in USD (1e8)

// // Event to log price updates
// event PriceUpdated(address indexed asset, uint256 newPrice);

// // Set price for an asset, only callable by the owner
// function setPrice(address asset, uint256 price) external onlyOwner {
//     require(price > 0, "Price must be greater than zero");
//     prices[asset] = price;

//     emit PriceUpdated(asset, price); // Emit event on price update
// }

// // Get the price of an asset
// function getPrice(address asset) external view returns (uint256) {
//     return prices[asset];
// }

// function getPrice(address asset) external view returns (uint256 price) {
//     address aggregator = aggregators[asset];
//     require(aggregator != address(0), "Aggregator not set");
//     (, int256 answer, , , ) = AggregatorV3Interface(aggregator)
//         .latestRoundData();
//     require(answer > 0, "Invalid price");
//     price = uint256(answer);
