const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CollateralManagerModuleV4", (m) => {
  const RESERVE_CONFIG_ADDRESS = "0x2B8BbB6680853f54C0aB4185F424c1BF65e13473";
  const PRICE_ORACLE_ADDRESS   = "0xd12bC116F032dc7fe68cfa70b24A98A508dd308F";
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

