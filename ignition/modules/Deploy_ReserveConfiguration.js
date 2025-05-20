const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ReserveConfigurationModuleV1", (m) => {
  const reserveConfig = m.contract("ReserveConfiguration"); 
  return { reserveConfig };
});

// npx hardhat ignition deploy ./ignition/modules/Deploy_ReserveConfiguration.js --network polygonAmoy

