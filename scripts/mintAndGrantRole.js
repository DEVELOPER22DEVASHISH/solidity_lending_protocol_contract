const { ethers } = require("hardhat");

async function main() {
  const [admin] = await ethers.getSigners();
  const adminAddress = admin.address;

  // Addresses (replace with your actual deployed contract addresses)
  const lendingPoolAddress = "0x516Fd9AC1D9a99EE9e2dd0C5074dC8920c467D8C";
  const lTokenDAIAddress = "0xb84796869790056B677ef8882B10FA2E4e1Ec2aa";
  const lTokenUSDCAddress = "0xC9e5319410DAB80b989B03193fC570775855a0D9";
  const lTokenUSDTAddress = "0x1cE5644607962911647dBc9DD87c0A5A3B7A88B2";
  const debtTokenDAIAddress = "0x0bC4b4ABD8797892b5F95B59FAda9d238d7cC9df";
  const debtTokenUSDCAddress = "0xDAb2C25D576457F5d79181e6b8B67d36ad60fCED";
  const debtTokenUSDTAddress = "0xc69825B375b7A53E72a6b8c764624ef9132F9643";

  // Role hashes
  const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));

  // LendingPool instance
  const lendingPool = await ethers.getContractAt("LendingPool", lendingPoolAddress, admin);

  // LTokens and DebtTokens
  const tokens = [
    { name: "LTokenDAI", address: lTokenDAIAddress },
    { name: "LTokenUSDC", address: lTokenUSDCAddress },
    { name: "LTokenUSDT", address: lTokenUSDTAddress },
    { name: "DebtTokenDAI", address: debtTokenDAIAddress },
    { name: "DebtTokenUSDC", address: debtTokenUSDCAddress },
    { name: "DebtTokenUSDT", address: debtTokenUSDTAddress },
  ];

  for (const token of tokens) {
    const contract = await ethers.getContractAt(token.name, token.address, admin);

    // Grant ADMIN_ROLE to admin (optional, for completeness)
    if (!(await contract.hasRole(ADMIN_ROLE, adminAddress))) {
      try {
        const tx = await contract.grantRole(ADMIN_ROLE, adminAddress);
        await tx.wait();
        console.log(`✅ Granted ADMIN_ROLE to ${adminAddress} for ${await contract.name()}`);
      } catch (e) {
        console.error(`❌ Grant ADMIN_ROLE failed for ${await contract.name()}:`, e.reason || e.message);
      }
    } else {
      console.log(`⚠️ ADMIN_ROLE already granted for ${await contract.name()}`);
    }

    // Grant MINTER_ROLE to LendingPool
    if (!(await contract.hasRole(MINTER_ROLE, lendingPoolAddress))) {
      try {
        const tx = await contract.grantRole(MINTER_ROLE, lendingPoolAddress);
        await tx.wait();
        console.log(`✅ Granted MINTER_ROLE to LendingPool for ${await contract.name()}`);
      } catch (e) {
        console.error(`❌ Grant MINTER_ROLE failed for ${await contract.name()}:`, e.reason || e.message);
      }
    } else {
      console.log(`⚠️ MINTER_ROLE already granted for ${await contract.name()}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/mintAndGrantRole.js --network polygonAmoy