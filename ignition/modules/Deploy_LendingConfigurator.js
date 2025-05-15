const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LendingConfiguratorModule", (m) => {

  const LENDING_POOL_ADDRESS = "0x2846b408cF34154b4207A4c944701f1bdCA9DCC9";
  const lendingConfigurator = m.contract("LendingConfigurator", [
    LENDING_POOL_ADDRESS
  ]);

  return { lendingConfigurator };
});

// npx hardhat ignition deploy ./ignition/modules/Deploy_LendingConfigurator.js --network polygonAmoy
// LendingConfiguratorModule#LendingConfigurator - 0x1eA5c40815d2422dD123b0a29C9391d050Cc8f71