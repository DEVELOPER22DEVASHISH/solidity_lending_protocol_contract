const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LendingConfiguratorModuleV2", (m) => {

  const LENDING_POOL_ADDRESS = "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3";
  const lendingConfigurator = m.contract("LendingConfigurator", [
    LENDING_POOL_ADDRESS
  ]);

  return { lendingConfigurator };
});

// npx hardhat ignition deploy ./ignition/modules/Deploy_LendingConfigurator.js --network polygonAmoy
