require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const {API_URL , PRIVATE_KEY } = process.env;
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat:{},
    polygonAmoy:{
      url: API_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};
