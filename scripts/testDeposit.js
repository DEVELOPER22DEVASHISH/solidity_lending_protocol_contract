
const { ethers } = require("hardhat");
const { parseUnits, formatUnits } = ethers;

const LENDING_POOL_ADDRESS = "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3";
const DAI_ADDRESS = "0xD7b22F1e8705dA9019eb571B17eBCeeC8Df4f933";
const RESERVE_CONFIG_ADDRESS = "0x2B8BbB6680853f54C0aB4185F424c1BF65e13473"; // update to your ReserveConfig address
const DEPOSIT_AMOUNT = parseUnits("1.0", 18); // 1 DAI

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Using signer:", signer.address);

  const ERC20 = await ethers.getContractAt("IERC20", DAI_ADDRESS, signer);
  const LendingPool = await ethers.getContractAt("LendingPool", LENDING_POOL_ADDRESS, signer);
  const ReserveConfig = await ethers.getContractAt("ReserveConfiguration", RESERVE_CONFIG_ADDRESS, signer);

  // 1. Check DAI balance
  const balance = await ERC20.balanceOf(signer.address);
  console.log("DAI Balance:", formatUnits(balance, 18));
  if (balance < DEPOSIT_AMOUNT) throw new Error("❌ Not enough DAI balance to deposit.");

  // 2. Check allowance
  const allowance = await ERC20.allowance(signer.address, LENDING_POOL_ADDRESS);
  console.log("Allowance:", formatUnits(allowance, 18));
  if (allowance < DEPOSIT_AMOUNT) {
    console.log(`Approving ${formatUnits(DEPOSIT_AMOUNT, 18)} DAI...`);
    const tx = await ERC20.approve(LENDING_POOL_ADDRESS, DEPOSIT_AMOUNT);
    await tx.wait();
    console.log("✅ Approved.");
  }

  // 3. Check LendingPool paused
  const paused = await LendingPool.paused();
  console.log("LendingPool paused:", paused);
  if (paused) throw new Error("❌ LendingPool is paused.");

  // 4. Check reserve is initialized
  const reserve = await LendingPool.reserves(DAI_ADDRESS);
  console.log("Reserve data:", reserve);
  if (!reserve.isInitialized) throw new Error("❌ Reserve is not initialized in the LendingPool.");

  // 5. Check reserve is active
  const config = await ReserveConfig.getConfig(DAI_ADDRESS);
  console.log("ReserveConfig:", config);
  if (!config.isActive) throw new Error("❌ Reserve is not active in ReserveConfiguration.");

  // 6. Simulate deposit
  try {
    await LendingPool.deposit(DAI_ADDRESS, DEPOSIT_AMOUNT);
    console.log("callStatic.deposit simulation: SUCCESS");
  } catch (err) {
    console.error("callStatic.deposit simulation: FAILED");
    console.dir(err, { depth: null });
    return;
  }

  // 7. Actually deposit
  try {
    const tx = await LendingPool.deposit(DAI_ADDRESS, DEPOSIT_AMOUNT);
    await tx.wait();
    console.log("✅ Deposit successful.");
  } catch (err) {
    console.error("Deposit failed:");
    console.dir(err, { depth: null });
  }
}

main().catch((error) => {
  console.error("Error running script:");
  console.error(error);
  process.exit(1);
});


// // npx hardhat run scripts/testDeposit.js --network polygonAmoy