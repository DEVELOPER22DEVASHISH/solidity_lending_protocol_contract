const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CollateralManagerModuleV2", (m) => {
  const RESERVE_CONFIG_ADDRESS = "0x2B8BbB6680853f54C0aB4185F424c1BF65e13473";
  const PRICE_ORACLE_ADDRESS   = "0x5F11F16E0C8ed9a469F8acEA61196c68AF19DfBD";
  const collateralManager = m.contract("CollateralManager", [
    RESERVE_CONFIG_ADDRESS,
    PRICE_ORACLE_ADDRESS
  ]);

  return { collateralManager };
});




 // for deploying multiple modules/contracts in a single command
// ignition/modules/CollateralManagerDeploy.js
// const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// module.exports = buildModule("CollateralManagerModule", (m) => {
//   // Deploy or use existing ReserveConfiguration
//   const reserveConfig = m.contract("ReserveConfiguration");
  
//   // Deploy or use existing PriceOracle
//   const priceOracle = m.contract("PriceOracle");
  
//   // Deploy CollateralManager with dependencies
//   const collateralManager = m.contract("CollateralManager", [
//     reserveConfig,
//     priceOracle
//   ]);

//   return { collateralManager };
// });

// npx hardhat ignition deploy ./ignition/modules/Deploy_CollateralManager.js --network polygonAmoy

// CollateralManagerModuleV2#CollateralManager - 0x993FC5F172280dCE3f9EF1622dF21718cc76835f