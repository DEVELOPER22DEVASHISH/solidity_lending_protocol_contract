// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("LTokenModule", (m) => {
  const lToken = m.contract("LToken"); 
  return { lToken };
})
// npx hardhat ignition deploy ./ignition/modules/Deploy_LToken.js --network polygonAmoy

