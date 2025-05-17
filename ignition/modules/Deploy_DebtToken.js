
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DebtTokenModule", (m) => {
  const debtToken = m.contract("DebtToken"); 
  return { debtToken };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_DebtToken.js --network polygonAmoy

