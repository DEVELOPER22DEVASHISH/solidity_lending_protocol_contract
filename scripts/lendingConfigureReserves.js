const { ethers } = require("hardhat");

// Deployed addresses (replace with your actual addresses if different)
const CONFIGURATOR_ADDRESS = "0x3b60b887A44bdb0471F5fd72dE7AE76638eC667A";
const reserves = [
  {
    symbol: "DAI",
    asset: "0xD7b22F1e8705dA9019eb571B17eBCeeC8Df4f933",
    lToken: "0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB",
    debtToken: "0x896cD573F421f01aabA9762C99699B1A2e19911f",
  },
  {
    symbol: "USDC",
    asset: "0x3434891fD32583E9BD2fA82A6f02aFa791d2710D",
    lToken: "0x4E6f61A57444b1EDe74E87316d4721F35f414208",
    debtToken: "0x5Ac6a22c619C9215fd7CAAC883Dd8801f07d4BD5",
  },
  {
    symbol: "USDT",
    asset: "0x0295EaA0A2477C5a073279f21CD1E4D843b89512",
    lToken: "0x4935FAB2f0A7d83acDcd3f455607C45ddC739383",
    debtToken: "0xaE6B6D63CC099EAc77D5FA63cd9567c98Ff4De39",
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