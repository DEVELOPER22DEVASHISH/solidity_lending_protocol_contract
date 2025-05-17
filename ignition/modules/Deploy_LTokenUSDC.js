const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LTokenUSDCModule", (m) => {
  const lTokenUSDC = m.contract("LTokenUSDC");
  return { lTokenUSDC };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_LTokenUSDC.js --network polygonAmoy