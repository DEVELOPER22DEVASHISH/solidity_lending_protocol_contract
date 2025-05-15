const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ReserveConfigurationModule", (m) => {
  const debtToken = m.contract("ReserveConfiguration"); 
  return { debtToken };
});

// npx hardhat ignition deploy ./ignition/modules/Deploy_ReserveConfiguration.js --network polygonAmoy

// ReserveConfigurationModule#ReserveConfiguration - 0x2B8BbB6680853f54C0aB4185F424c1BF65e13473