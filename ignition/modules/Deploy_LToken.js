// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("LTokenModule", (m) => {
  const lToken = m.contract("LToken"); 
  return { lToken };
})
// npx hardhat ignition deploy ./ignition/modules/Deploy_LToken.js --network polygonAmoy

// Deployed Address

// LTokenModule#LToken - 0xB45f640bCe3C0366e67aa3bE6F3742F7353Fc85C