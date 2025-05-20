const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CollateralManagerModuleV1", (m) => {
  const RESERVE_CONFIG_ADDRESS = "0xA6a5c6865fd7f34f8066695203201418c66751E6";
  const PRICE_ORACLE_ADDRESS   = "0x7E0FA3924dcd8F7bF4730d32F867546d9D840158";
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

