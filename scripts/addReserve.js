const { ethers } = require("hardhat");

const lendingPoolAddress = "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3"; 
const reserves = [
  {
    symbol: "USDC",
    asset: "0xYourUSDCAddress",        // ERC20 token address
    lToken: "0xYourUSDCLTokenAddress", // LToken address for USDC
    debtToken: "0xYourUSDCDebtTokenAddress", // DebtToken address for USDC
  },
  {
    symbol: "DAI",
    asset: "0xYourDAIAddress",
    lToken: "0xYourDAILTokenAddress",
    debtToken: "0xYourDAIDebtTokenAddress",
  },

];

async function initReserve({ symbol, asset, lToken, debtToken }) {
  const [admin] = await ethers.getSigners();
  console.log(`Using admin: ${admin.address}`);

  const lendingPool = await ethers.getContractAt("LendingPool", lendingPoolAddress, admin);

  try {
    const tx = await lendingPool.initReserve(asset, lToken, debtToken);
    await tx.wait();
    console.log(`✅ Reserve for ${symbol} initialized!`);
  } catch (err) {
    if (err.message.includes("ReserveAlreadyInitialized")) {
      console.log(`⚠️ Reserve for ${symbol} already initialized.`);
    } else {
      console.error(`❌ Error initializing reserve for ${symbol}:`, err.reason || err.message);
    }
  }
}

async function main() {
  for (const reserve of reserves) {
    await initReserve(reserve);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
c