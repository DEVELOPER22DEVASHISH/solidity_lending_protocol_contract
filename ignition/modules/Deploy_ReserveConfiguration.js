const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ReserveConfigurationModule", (m) => {
  const reserveConfig = m.contract("ReserveConfiguration"); 
  return { reserveConfig };
});

// npx hardhat ignition deploy ./ignition/modules/Deploy_ReserveConfiguration.js --network polygonAmoy

// ReserveConfigurationModule#ReserveConfiguration - 0x2B8BbB6680853f54C0aB4185F424c1BF65e13473