const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LTokenUSDTModule", (m) => {
  const lTokenUSDT = m.contract("LTokenUSDT");
  return { lTokenUSDT };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_LTokenUSDT.js --network polygonAmoy