
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DebtTokenModule", (m) => {
  const debtToken = m.contract("DebtToken"); 
  return { debtToken };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_DebtToken.js --network polygonAmoy

// DebtTokenModule#DebtToken - 0xCAEF2b544aF3dDE697fB38267a40BB31CFF3F958