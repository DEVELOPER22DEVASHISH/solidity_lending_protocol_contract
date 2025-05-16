const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PriceOracleModuleV2", (m) => {
  const priceOracle = m.contract("PriceOracle"); 
  return { priceOracle };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_PriceOracle.js --network polygonAmoy