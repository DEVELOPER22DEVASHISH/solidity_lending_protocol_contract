const { ethers } = require("hardhat");

// ====== CONFIGURATION ======
const reserveConfigAddress = "0x2B8BbB6680853f54C0aB4185F424c1BF65e13473"; 

const reserves = [
  {
    symbol: "USDC",
    asset: "0xYourUSDCAddress",
    ltv: "0.75",                  // 75%
    liquidationThreshold: "0.80", // 80%
    liquidationBonus: "1.05",     // 105% (5% bonus)
    isActive: true
  },
  {
    symbol: "DAI",
    asset: "0xYourDAIAddress",
    ltv: "0.80",
    liquidationThreshold: "0.85",
    liquidationBonus: "1.08",
    isActive: true
  },

];

async function setReserveConfig(reserve, contract) {
  const ltv = ethers.utils.parseUnits(reserve.ltv, 18);
  const liquidationThreshold = ethers.utils.parseUnits(reserve.liquidationThreshold, 18);
  const liquidationBonus = ethers.utils.parseUnits(reserve.liquidationBonus, 18);

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
      console.log(`   LTV: ${ethers.utils.formatUnits(config.ltv, 18)}`);
      console.log(`   Liquidation Threshold: ${ethers.utils.formatUnits(config.liquidationThreshold, 18)}`);
      console.log(`   Liquidation Bonus: ${ethers.utils.formatUnits(config.liquidationBonus, 18)}`);
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
