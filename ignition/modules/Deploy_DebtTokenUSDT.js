const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DebtTokenUSDTModule", (m) => {
  const debtTokenUSDT = m.contract("DebtTokenUSDT");
  return { debtTokenUSDT };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_DebtTokenUSDT.js --network polygonAmoy