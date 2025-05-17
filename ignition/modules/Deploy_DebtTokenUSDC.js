const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DebtTokenUSDCModule", (m) => {
  const debtTokenUSDC = m.contract("DebtTokenUSDC");
  return { debtTokenUSDC };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_DebtTokenUSDC.js --network polygonAmoy