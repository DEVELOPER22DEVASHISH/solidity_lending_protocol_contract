
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("QBDTokenModule", (m) => {
  const QBDToken = m.contract("QBDToken"); 
  return { QBDToken };
});
// npx hardhat ignition deploy ./ignition/modules/Deploy_QBDToken.js --network polygonAmoy

// QBDTokenModule#QBDToken - 0x810d670a3B2151bdC5603f15f5fa556167f41eB4
