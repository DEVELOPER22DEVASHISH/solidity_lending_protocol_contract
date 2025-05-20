const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LendingConfiguratorModuleV1", (m) => {

  const LENDING_POOL_ADDRESS = "0x516Fd9AC1D9a99EE9e2dd0C5074dC8920c467D8C";
  const lendingConfigurator = m.contract("LendingConfigurator", [
    LENDING_POOL_ADDRESS
  ]);

  return { lendingConfigurator };
});

// npx hardhat ignition deploy ./ignition/modules/Deploy_LendingConfigurator.js --network polygonAmoy
