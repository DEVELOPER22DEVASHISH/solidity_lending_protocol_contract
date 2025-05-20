const { ethers } = require("hardhat");
const { parseUnits, formatUnits } = ethers;

// ====== CONFIGURATION ======
const reserveConfigAddress = "0xA6a5c6865fd7f34f8066695203201418c66751E6"; 

const reserves = [
  {
    symbol: "USDC",
    asset: "0x0207e57106Bc422e97eA7B225a62c147b6304671",
    ltv: "0.75",                  // 75%
    liquidationThreshold: "0.80", // 80%
    liquidationBonus: "1.05",     // 105% (5% bonus)
    isActive: true
  },
  {
    symbol: "DAI",
    asset: "0xcf2A8631d4f14eB01e73813D4a7dB6238318ABE6",
    ltv: "0.80",
    liquidationThreshold: "0.85",
    liquidationBonus: "1.08",
    isActive: true
  },
   {
    symbol: "USDT",
    asset: "0x4813a8fB4309853b8df25c74A59cea6Ebef42a1E",
    ltv: "0.80",
    liquidationThreshold: "0.85",
    liquidationBonus: "1.08",
    isActive: true
  },

];

async function setReserveConfig(reserve, contract) {
  const ltv = parseUnits(reserve.ltv, 18);
  const liquidationThreshold = parseUnits(reserve.liquidationThreshold, 18);
  const liquidationBonus = parseUnits(reserve.liquidationBonus, 18);

  try {
    const tx = await contract.setConfig(
      reserve.asset,
      ltv,
      liquidationThreshold,
      liquidationBonus,
      reserve.isActive
    );
    await tx.wait();
    console.log(`✅ Config set for ${reserve.symbol} (${reserve.asset})`);
  } catch (err) {
    console.error(`❌ Error setting config for ${reserve.symbol}:`, err.reason || err.message);
  }
}

async function main() {
  const [admin] = await ethers.getSigners();
  const reserveConfig = await ethers.getContractAt(
    "ReserveConfiguration",
    reserveConfigAddress,
    admin
  );

  for (const reserve of reserves) {
    await setReserveConfig(reserve, reserveConfig);

    // Optional: Fetch and display the config for verification
    try {
      const config = await reserveConfig.getConfig(reserve.asset);
      console.log(`   LTV: ${formatUnits(config.ltv, 18)}`);
      console.log(`   Liquidation Threshold: ${formatUnits(config.liquidationThreshold, 18)}`);
      console.log(`   Liquidation Bonus: ${formatUnits(config.liquidationBonus, 18)}`);
      console.log(`   Active: ${config.isActive}\n`);
    } catch (err) {
      console.error(`   ❌ Error fetching config for ${reserve.symbol}:`, err.reason || err.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/setReserveConfig.js --network polygonAmoy