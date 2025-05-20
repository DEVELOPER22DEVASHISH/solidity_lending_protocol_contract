const { ethers } = require("hardhat");

const LENDING_POOL = "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3";
const TOKENS = [
  { symbol: "DAI", lToken: "0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB", debtToken: "0x896cD573F421f01aabA9762C99699B1A2e19911f" },
  { symbol: "USDC", lToken: "0x4E6f61A57444b1EDe74E87316d4721F35f414208", debtToken: "0x5Ac6a22c619C9215fd7CAAC883Dd8801f07d4BD5" },
  { symbol: "USDT", lToken: "0x4935FAB2f0A7d83acDcd3f455607C45ddC739383", debtToken: "0xaE6B6D63CC099EAc77D5FA63cd9567c98Ff4De39" },
];

async function main() {
  const [admin] = await ethers.getSigners();
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  for (const { symbol, lToken, debtToken } of TOKENS) {
    const ltoken = await ethers.getContractAt("LToken", lToken, admin);
    const debttoken = await ethers.getContractAt("DebtToken", debtToken, admin);
    const ltokenMinter = await ltoken.hasRole(MINTER_ROLE, LENDING_POOL);
    const debttokenMinter = await debttoken.hasRole(MINTER_ROLE, LENDING_POOL);
    console.log(`${symbol} LToken LendingPool MINTER_ROLE:`, ltokenMinter);
    console.log(`${symbol} DebtToken LendingPool MINTER_ROLE:`, debttokenMinter);
  }
}

main().catch(console.error);

// npx hardhat run scripts/checkMinterRole.js --network polygonAmoy