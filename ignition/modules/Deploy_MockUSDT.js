const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MockUSDTModule", (m) => {
  const mockUSDT = m.contract("MockUSDT");
  return { mockUSDT };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_MockUSDT.js --network polygonAmoy