const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LTokenDAIModule", (m) => {
  const lTokenDAI = m.contract("LTokenDAI");
  return { lTokenDAI };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_LTokenDAI.js --network polygonAmoy
