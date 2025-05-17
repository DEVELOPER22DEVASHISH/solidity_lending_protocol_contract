const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MockUSDCModule", (m) => {
  const mockUSDC = m.contract("MockUSDC");
  return { mockUSDC };
});

// npx hardhat ignition deploy ./ignition/modules/Deploy_MockUSDC.js --network polygonAmoy