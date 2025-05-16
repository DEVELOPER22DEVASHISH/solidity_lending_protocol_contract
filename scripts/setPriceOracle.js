const { ethers } = require("hardhat");

async function main() {
  // Replace with your deployed PriceOracle contract address
  const priceOracleAddress = "0xYourPriceOracleAddress"; // <-- Change this!

  // Replace with your actual ERC20 token addresses
  const assets = {
    USDC:  "0xYourUSDCAddress",   // <-- Change this!
    DAI:   "0xYourDAIAddress",    // <-- Change this!
    ETH:   "0xYourWETHAddress",   // <-- Change this!
    MATIC: "0xYourWMATICAddress", // <-- Change this!
    // Add more if needed
  };

  // Polygon Amoy Chainlink aggregator addresses
  const aggregators = {
    USDC:  "0x1b8739bB4CdF0089d07097A9Ae5Bd274b29C6F16",
    DAI:   "0x1896522f28bF5912dbA483AC38D7eE4c920fDB6E",
    ETH:   "0xF0d50568e3A7e8259E16663972b11910F89BD8e7",
    MATIC: "0x001382149eBa3441043c1c66972b4772963f5D43",
    // Add more if needed
  };

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const priceOracle = await ethers.getContractAt("PriceOracle", priceOracleAddress);

  // 1. Set aggregators for all assets
  for (const [symbol, tokenAddress] of Object.entries(assets)) {
    const aggregatorAddress = aggregators[symbol];
    if (!aggregatorAddress) {
      console.log(`No aggregator for ${symbol}, skipping...`);
      continue;
    }
    console.log(`Setting aggregator for ${symbol}: ${aggregatorAddress}`);
    const tx = await priceOracle.setAggregator(tokenAddress, aggregatorAddress);
    await tx.wait();
    console.log(`Aggregator set for ${symbol}`);
  }

  // 2. Call and print all functions for each asset
  for (const [symbol, tokenAddress] of Object.entries(assets)) {
    console.log(`\n--- ${symbol} ---`);
    // getAggregator
    const aggregator = await priceOracle.getAggregator(tokenAddress);
    console.log(`Aggregator: ${aggregator}`);

    // getAggregatorDecimals
    try {
      const decimals = await priceOracle.getAggregatorDecimals(tokenAddress);
      console.log(`Decimals: ${decimals}`);
    } catch (err) {
      console.log(`Decimals: Error - ${err.message}`);
    }

    // getRawPrice
    try {
      const rawPrice = await priceOracle.getRawPrice(tokenAddress);
      console.log(`Raw Price: ${rawPrice.toString()}`);
    } catch (err) {
      console.log(`Raw Price: Error - ${err.message}`);
    }

    // getPrice (normalized to 18 decimals)
    try {
      const normPrice = await priceOracle.getPrice(tokenAddress);
      // Print as human-readable USD value
      console.log(`Normalized Price (18 decimals): ${ethers.utils.formatUnits(normPrice, 18)} USD`);
    } catch (err) {
      console.log(`Normalized Price: Error - ${err.message}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
