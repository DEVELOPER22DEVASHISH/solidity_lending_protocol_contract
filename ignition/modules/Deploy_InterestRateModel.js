
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("InterestRateModelModuleV1", (m) => {
  const interestRateModel = m.contract("InterestRateModel"); // No constructor args
  return { interestRateModel };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_InterestRateModel.js --network polygonAmoy

