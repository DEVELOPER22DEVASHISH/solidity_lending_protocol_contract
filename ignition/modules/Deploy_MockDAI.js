const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MockDAIModule", (m) => {
  const mockDAI = m.contract("MockDAI");
  return { mockDAI };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_MockDAI.js --network polygonAmoy