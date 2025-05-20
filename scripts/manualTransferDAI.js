const { ethers } = require("hardhat");

const DAI_ADDRESS = "0xD7b22F1e8705dA9019eb571B17eBCeeC8Df4f933";
const LENDING_POOL_ADDRESS = "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Using signer:", signer.address);

  const ERC20 = await ethers.getContractAt("IERC20", DAI_ADDRESS, signer);

  // Check balance
  const balance = await ERC20.balanceOf(signer.address);
  console.log("DAI Balance:", ethers.formatUnits(balance, 18));

  if (balance < ethers.parseUnits("0.1", 18)) {
    throw new Error("Not enough DAI to transfer 0.1");
  }

  // Transfer 0.1 DAI to LendingPool
  const tx = await ERC20.transfer(LENDING_POOL_ADDRESS, ethers.parseUnits("0.1", 18));
  await tx.wait();
  console.log("✅ Manual transfer of 0.1 DAI to LendingPool succeeded!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/manualTransferDAI.js --network polygonAmoy