const { ethers } = require("hardhat");

const lendingPoolAddress = "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3"; 
const reserves = [
  {
    symbol: "USDC",
    asset: "0x3434891fD32583E9BD2fA82A6f02aFa791d2710D",        // ERC20 token address
    lToken: "0x4E6f61A57444b1EDe74E87316d4721F35f414208", // LToken address for USDC
    debtToken: "0x5Ac6a22c619C9215fd7CAAC883Dd8801f07d4BD5", // DebtToken address for USDC
  },
  {
    symbol: "DAI",
    asset: "0xD7b22F1e8705dA9019eb571B17eBCeeC8Df4f933",
    lToken: "0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB",
    debtToken: "0x896cD573F421f01aabA9762C99699B1A2e19911f",
  },
  {
    symbol: "USDT",
    asset: "0x0295EaA0A2477C5a073279f21CD1E4D843b89512",
    lToken: "0x4935FAB2f0A7d83acDcd3f455607C45ddC739383",
    debtToken: "0xaE6B6D63CC099EAc77D5FA63cd9567c98Ff4De39",
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
 // npx hardhat run scripts/addReserve.js --network polygonAmoy