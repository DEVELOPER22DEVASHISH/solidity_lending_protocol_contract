const { ethers } = require("hardhat");

const priceOracleAddress = "0xd12bC116F032dc7fe68cfa70b24A98A508dd308F";
const assets = {
  USDC: "0xYourUSDCAddress",
  DAI: "0xYourDAIAddress",
  ETH: "0xYourWETHAddress",
  MATIC: "0xYourWMATICAddress",
};

const aggregators = {
  USDC: "0x1b8739bB4CdF0089d07097A9Ae5Bd274b29C6F16",
  DAI: "0x1896522f28bF5912dbA483AC38D7eE4c920fDB6E",
  ETH: "0xF0d50568e3A7e8259E16663972b11910F89BD8e7",
  MATIC: "0x001382149eBa3441043c1c66972b4772963f5D43",
};

let priceOracle;
let signer;

async function init() {
  [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);
  priceOracle = await ethers.getContractAt("PriceOracle", priceOracleAddress);
}

// 1️⃣ Set Aggregator for a given asset
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

// 2️⃣ Get Aggregator address
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

// 3️⃣ Get Aggregator Decimals
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

// 4️⃣ Get Raw Price
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

// 5️⃣ Get Normalized Price
async function getPrice(symbol) {
  const asset = assets[symbol];
  try {
    const price = await priceOracle.getPrice(asset);
    // Always 18 decimals as per your contract normalization
    console.log(`Normalized Price for ${symbol}: ${ethers.utils.formatUnits(price, 18)} USD`);
    return price;
  } catch (e) {
    console.log(`❌ Error getting normalized price for ${symbol}: ${e.reason || e.message}`);
  }
}

// 🚀 Main demo
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

  // Repeat for ETH, MATIC, etc. as needed
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
