const { ethers } = require("hardhat");

const LENDING_POOL_ADDRESS = "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3";

async function main() {
  const [admin] = await ethers.getSigners();
  const lendingPool = await ethers.getContractAt("LendingPool", LENDING_POOL_ADDRESS, admin);

  // Check if already unpaused
  const paused = await lendingPool.paused();
  if (!paused) {
    console.log("LendingPool is already unpaused.");
    return;
  }

  // Unpause the pool
  const tx = await lendingPool.unpause();
  await tx.wait();
  console.log("✅ LendingPool is now unpaused!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/unpauseLendingPool.js --network polygonAmoy