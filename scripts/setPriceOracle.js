const { ethers, formatUnits } = require("hardhat");

const priceOracleAddress = "0x7E0FA3924dcd8F7bF4730d32F867546d9D840158";
const assets = {
  USDC: "0x0207e57106Bc422e97eA7B225a62c147b6304671",
  DAI: "0xcf2A8631d4f14eB01e73813D4a7dB6238318ABE6",
  USDT: "0x4813a8fB4309853b8df25c74A59cea6Ebef42a1E",
};

const aggregators = {
  USDC: "0x1b8739bB4CdF0089d07097A9Ae5Bd274b29C6F16", 
  DAI: "0x1896522f28bF5912dbA483AC38D7eE4c920fDB6E",  
  USDT: "0x3aC23DcB4eCfcBd24579e1f34542524d0E4eDeA8", 
};

let priceOracle;
let signer;

async function init() {
  [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);
  priceOracle = await ethers.getContractAt("PriceOracle", priceOracleAddress);
}

// Set Aggregator for a given asset
async function setAggregator(symbol) {
  const asset = assets[symbol];
  const aggregator = aggregators[symbol];
  if (!asset || !aggregator) {
    console.log(`Missing address for ${symbol}`);
    return;
  }
  try {
    const tx = await priceOracle.setAggregator(asset, aggregator);
    await tx.wait();
    console.log(`✅ Aggregator set for ${symbol}`);
  } catch (e) {
    console.log(`❌ Error setting aggregator for ${symbol}: ${e.reason || e.message}`);
  }
}

// Get Aggregator address
async function getAggregator(symbol) {
  const asset = assets[symbol];
  try {
    const address = await priceOracle.getAggregator(asset);
    console.log(`Aggregator for ${symbol}: ${address}`);
    return address;
  } catch (e) {
    console.log(`❌ Error getting aggregator for ${symbol}: ${e.reason || e.message}`);
  }
}

// Get Aggregator Decimals
async function getAggregatorDecimals(symbol) {
  const asset = assets[symbol];
  try {
    const decimals = await priceOracle.getAggregatorDecimals(asset);
    console.log(`Decimals for ${symbol}: ${decimals}`);
    return decimals;
  } catch (e) {
    console.log(`❌ Error getting decimals for ${symbol}: ${e.reason || e.message}`);
  }
}

// Get Raw Price
async function getRawPrice(symbol) {
  const asset = assets[symbol];
  try {
    const rawPrice = await priceOracle.getRawPrice(asset);
    console.log(`Raw Price for ${symbol}: ${rawPrice.toString()}`);
    return rawPrice;
  } catch (e) {
    console.log(`❌ Error getting raw price for ${symbol}: ${e.reason || e.message}`);
  }
}

// Get Normalized Price 
async function getPrice(symbol) {
  const asset = assets[symbol];
  try {
    const price = await priceOracle.getPrice(asset);
    // Always 18 decimals as per your contract normalization
    console.log(`Normalized Price for ${symbol}: ${ethers.formatUnits(price, 18)} USD`);
    return price;
  } catch (e) {
    console.log(`❌ Error getting normalized price for ${symbol}: ${e.reason || e.message}`);
  }
}

// Main demo
async function main() {
  await init();

  // Call for USDC
  await setAggregator("USDC");
  await getAggregator("USDC");
  await getAggregatorDecimals("USDC");
  await getRawPrice("USDC");
  await getPrice("USDC");

  // Call for DAI
  await setAggregator("DAI");
  await getAggregator("DAI");
  await getAggregatorDecimals("DAI");
  await getRawPrice("DAI");
  await getPrice("DAI");

  // Call for USDT
  await setAggregator("USDT");
  await getAggregator("USDT");
  await getAggregatorDecimals("USDT");
  await getRawPrice("USDT");
  await getPrice("USDT");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// // npx hardhat run scripts/setPriceOracle.js --network polygonAmoy