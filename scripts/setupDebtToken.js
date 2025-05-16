const { ethers } = require("hardhat");

// ====== CONFIGURATION ======
const debtTokenAddress = "0xCAEF2b544aF3dDE697fB38267a40BB31CFF3F958"; 
const userAddress = "0xUserAddress";              //  user's address for mint/burn
const adminAddress = "0xAdminAddress";            // need to replace with an address to add/remove as admin
const minterAddress = "0xMinterAddress";          // need to replace with an address to add/remove as minter

const mintAmount = ethers.utils.parseUnits("1000", 18); // 1000 dUSD
const burnAmount = ethers.utils.parseUnits("500", 18);  // 500 dUSD

// ====== SCRIPT FUNCTIONS ======
let debtToken;
let signer;

async function init() {
  [signer] = await ethers.getSigners();
  debtToken = await ethers.getContractAt("DebtToken", debtTokenAddress, signer);
  console.log("Using signer:", signer.address);
}

async function mintTokens() {
  try {
    const tx = await debtToken.mint(userAddress, mintAmount);
    await tx.wait();
    console.log(`✅ Minted ${ethers.utils.formatUnits(mintAmount, 18)} dUSD to ${userAddress}`);
  } catch (e) {
    console.error("❌ Mint failed:", e.reason || e.message);
  }
}

async function burnTokens() {
  try {
    const tx = await debtToken.burn(userAddress, burnAmount);
    await tx.wait();
    console.log(`✅ Burned ${ethers.utils.formatUnits(burnAmount, 18)} dUSD from ${userAddress}`);
  } catch (e) {
    console.error("❌ Burn failed:", e.reason || e.message);
  }
}

async function addMinter() {
  try {
    const tx = await debtToken.addMinter(minterAddress);
    await tx.wait();
    console.log(`✅ Added MINTER_ROLE to ${minterAddress}`);
  } catch (e) {
    console.error("❌ Add minter failed:", e.reason || e.message);
  }
}

async function removeMinter() {
  try {
    const tx = await debtToken.removeMinter(minterAddress);
    await tx.wait();
    console.log(`✅ Removed MINTER_ROLE from ${minterAddress}`);
  } catch (e) {
    console.error("❌ Remove minter failed:", e.reason || e.message);
  }
}

async function addAdmin() {
  try {
    const tx = await debtToken.addAdmin(adminAddress);
    await tx.wait();
    console.log(`✅ Added ADMIN_ROLE to ${adminAddress}`);
  } catch (e) {
    console.error("❌ Add admin failed:", e.reason || e.message);
  }
}

async function removeAdmin() {
  try {
    const tx = await debtToken.removeAdmin(adminAddress);
    await tx.wait();
    console.log(`✅ Removed ADMIN_ROLE from ${adminAddress}`);
  } catch (e) {
    console.error("❌ Remove admin failed:", e.reason || e.message);
  }
}

async function checkRoles(address) {
  const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
  const ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
  const isMinter = await debtToken.hasRole(MINTER_ROLE, address);
  const isAdmin = await debtToken.hasRole(ADMIN_ROLE, address);
  console.log(`${address} - MINTER_ROLE: ${isMinter}, ADMIN_ROLE: ${isAdmin}`);
}

// ====== MAIN DEMO ======
async function main() {
  await init();
  // await mintTokens();
  // await burnTokens();
  // await addMinter();
  // await removeMinter();
  // await addAdmin();
  // await removeAdmin();
  // await checkRoles(userAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
