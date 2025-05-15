
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("InterestRateModelModule", (m) => {
  const interestRateModel = m.contract("InterestRateModel"); // No constructor args
  return { interestRateModel };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_InterestRateModel.js --network polygonAmoy

// InterestRateModelModule#InterestRateModel - 0xF04FE514547128C320e4f6fFB614824291962D81