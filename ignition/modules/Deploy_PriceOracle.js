const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PriceOracleModule", (m) => {
  const debtToken = m.contract("PriceOracle"); 
  return { debtToken };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_PriceOracle.js --network polygonAmoy