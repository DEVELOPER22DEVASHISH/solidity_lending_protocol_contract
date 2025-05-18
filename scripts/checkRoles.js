const { ethers } = require("hardhat");

async function main() {

  const lToken = await ethers.getContractAt("LToken", "0xB45f640bCe3C0366e67aa3bE6F3742F7353Fc85C", /* signer */);
  const debtToken = await ethers.getContractAt("DebtToken", "0xCAEF2b544aF3dDE697fB38267a40BB31CFF3F958", /* signer */);

  const addressToCheck = "0x669be6E4FfcF41D8Db587Bd56035Ae8E541ed12D";

  const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));

  const lTokenIsAdmin = await lToken.hasRole(ADMIN_ROLE, addressToCheck);
  const lTokenIsMinter = await lToken.hasRole(MINTER_ROLE, addressToCheck);

  const debtTokenIsAdmin = await debtToken.hasRole(ADMIN_ROLE, addressToCheck);
  const debtTokenIsMinter = await debtToken.hasRole(MINTER_ROLE, addressToCheck);

  console.log(`LToken ADMIN_ROLE: ${lTokenIsAdmin}`);
  console.log(`LToken MINTER_ROLE: ${lTokenIsMinter}`);
  console.log(`DebtToken ADMIN_ROLE: ${debtTokenIsAdmin}`);
  console.log(`DebtToken MINTER_ROLE: ${debtTokenIsMinter}`);
}

main().catch(console.error);

 // npx hardhat run scripts/checkRoles.js --network polygonAmoy

