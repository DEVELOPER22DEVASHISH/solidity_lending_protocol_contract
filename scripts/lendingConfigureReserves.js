const { ethers } = require("hardhat");

// Deployed addresses (replace with your actual addresses if different)
const CONFIGURATOR_ADDRESS = "0x3b60b887A44bdb0471F5fd72dE7AE76638eC667A";
const reserves = [
  {
    symbol: "DAI",
    asset: "0xcf2A8631d4f14eB01e73813D4a7dB6238318ABE6",
    lToken: "0xb84796869790056B677ef8882B10FA2E4e1Ec2aa",
    debtToken: "0x0bC4b4ABD8797892b5F95B59FAda9d238d7cC9df",
  },
  {
    symbol: "USDC",
    asset: "0x0207e57106Bc422e97eA7B225a62c147b6304671",
    lToken: "0xC9e5319410DAB80b989B03193fC570775855a0D9",
    debtToken: "0xDAb2C25D576457F5d79181e6b8B67d36ad60fCED",
  },
  {
    symbol: "USDT",
    asset: "0x4813a8fB4309853b8df25c74A59cea6Ebef42a1E",
    lToken: "0x1cE5644607962911647dBc9DD87c0A5A3B7A88B2",
    debtToken: "0xc69825B375b7A53E72a6b8c764624ef9132F9643",
  },
];

async function main() {
  const [admin] = await ethers.getSigners();
  const configurator = await ethers.getContractAt("LendingConfigurator", CONFIGURATOR_ADDRESS, admin);

  for (const { symbol, asset, lToken, debtToken } of reserves) {
    // Add reserve
    try {
      const tx = await configurator.addReserve(asset, lToken, debtToken);
      await tx.wait();
      console.log(`✅ Reserve for ${symbol} initialized via LendingConfigurator.`);
    } catch (e) {
      if (e.message.includes("already initialized") || e.message.includes("revert")) {
        console.log(`⚠️ Reserve for ${symbol} may already be initialized.`);
      } else {
        console.error(`❌ Error initializing reserve for ${symbol}:`, e.message);
      }
    }

    // Optionally, update LToken and DebtToken (demonstration)
    try {
      const tx1 = await configurator.configureReserveLToken(asset, lToken);
      await tx1.wait();
      console.log(`✅ LToken for ${symbol} configured.`);

      const tx2 = await configurator.configureReserveDebtToken(asset, debtToken);
      await tx2.wait();
      console.log(`✅ DebtToken for ${symbol} configured.`);
    } catch (e) {
      if (e.message.includes("revert")) {
        console.log(`⚠️ LToken or DebtToken for ${symbol} may already be set.`);
      } else {
        console.error(`❌ Error configuring tokens for ${symbol}:`, e.message);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/lendingConfigureReserves.js --network polygonAmoy