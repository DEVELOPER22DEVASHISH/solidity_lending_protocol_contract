

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DebtTokenDAIModule", (m) => {
  const debtTokenDAI = m.contract("DebtTokenDAI");
  return { debtTokenDAI };
});

// npx hardhat ignition deploy ./ignition/modules/Deploy_DebtTokenDAI.js --network polygonAmoy