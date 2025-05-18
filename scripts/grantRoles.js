const { ethers } = require("hardhat");

async function main() {
  const [admin] = await ethers.getSigners();
  const adminAddress = admin.address;

  const lToken = await ethers.getContractAt("LToken", "0xB45f640bCe3C0366e67aa3bE6F3742F7353Fc85C", admin);
  const debtToken = await ethers.getContractAt("DebtToken", "0xCAEF2b544aF3dDE697fB38267a40BB31CFF3F958", admin);
  const lendingPool = await ethers.getContractAt("LendingPool", "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3", admin);
  const lendingConfigurator = await ethers.getContractAt("LendingConfigurator", "0x3b60b887A44bdb0471F5fd72dE7AE76638eC667A", admin);

  // Role hashes
  const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const LIQUIDATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("LIQUIDATOR_ROLE"));

  // Helper to check role
  async function hasRole(contract, role, address) {
    return await contract.hasRole(role, address);
  }

  // Grant roles for LToken and DebtToken
  for (const token of [lToken, debtToken]) {
    // Grant ADMIN_ROLE
    if (!(await hasRole(token, ADMIN_ROLE, adminAddress))) {
      try {
        const tx = await token.grantRole(ADMIN_ROLE, adminAddress);
        await tx.wait();
        console.log(`✅ Granted ADMIN_ROLE to ${adminAddress} for ${await token.name()}`);
      } catch (e) {
        console.error(`❌ Grant ADMIN_ROLE failed for ${await token.name()}:`, e.reason || e.message);
      }
    } else {
      console.log(`⚠️ ADMIN_ROLE already granted for ${await token.name()}`);
    }
    // Grant MINTER_ROLE
    if (!(await hasRole(token, MINTER_ROLE, adminAddress))) {
      try {
        const tx = await token.grantRole(MINTER_ROLE, adminAddress);
        await tx.wait();
        console.log(`✅ Granted MINTER_ROLE to ${adminAddress} for ${await token.name()}`);
      } catch (e) {
        console.error(`❌ Grant MINTER_ROLE failed for ${await token.name()}:`, e.reason || e.message);
      }
    } else {
      console.log(`⚠️ MINTER_ROLE already granted for ${await token.name()}`);
    }
  }

  // Grant ADMIN_ROLE for LendingPool and LendingConfigurator
  for (const contract of [lendingPool, lendingConfigurator]) {
    if (!(await hasRole(contract, ADMIN_ROLE, adminAddress))) {
      try {
        const tx = await contract.grantRole(ADMIN_ROLE, adminAddress);
        await tx.wait();
        console.log(`✅ Granted ADMIN_ROLE to ${adminAddress} for ${contract.target}`);
      } catch (e) {
        console.error(`❌ Grant ADMIN_ROLE failed for ${contract.target}:`, e.reason || e.message);
      }
    } else {
      console.log(`⚠️ ADMIN_ROLE already granted for ${contract.target}`);
    }
  }

  // Optionally, grant LIQUIDATOR_ROLE to admin for LendingPool
  if (!(await hasRole(lendingPool, LIQUIDATOR_ROLE, adminAddress))) {
    try {
      const tx = await lendingPool.grantRole(LIQUIDATOR_ROLE, adminAddress);
      await tx.wait();
      console.log(`✅ Granted LIQUIDATOR_ROLE to ${adminAddress} for LendingPool`);
    } catch (e) {
      console.error(`❌ Grant LIQUIDATOR_ROLE failed for LendingPool:`, e.reason || e.message);
    }
  } else {
    console.log(`⚠️ LIQUIDATOR_ROLE already granted for LendingPool`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// //   // npx hardhat run scripts/grantRoles.js --network polygonAmoy