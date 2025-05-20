const { ethers } = require("hardhat");
const { parseUnits, formatUnits } = ethers;

const LENDING_POOL_ADDRESS = "0x516Fd9AC1D9a99EE9e2dd0C5074dC8920c467D8C";
const DAI_ADDRESS = "0xcf2A8631d4f14eB01e73813D4a7dB6238318ABE6";
const RESERVE_CONFIG_ADDRESS = "0xA6a5c6865fd7f34f8066695203201418c66751E6";
const DEPOSIT_AMOUNT = parseUnits("1.0", 18); // 1 DAI

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Using signer:", signer.address);

  // Contracts
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

  // 4. Check reserve is initialized and log all reserve data
  const reserve = await LendingPool.reserves(DAI_ADDRESS);
  console.log("Reserve data:", reserve);
  if (!reserve.isInitialized) throw new Error("❌ Reserve is not initialized in the LendingPool.");
  if (!reserve.lToken || reserve.lToken === ethers.ZeroAddress) throw new Error("❌ LToken address is zero.");
  if (!reserve.debtToken || reserve.debtToken === ethers.ZeroAddress) throw new Error("❌ DebtToken address is zero.");

  // 5. Check reserve is active
  const config = await ReserveConfig.getConfig(DAI_ADDRESS);
  console.log("ReserveConfig:", config);
  if (!config.isActive) throw new Error("❌ Reserve is not active in ReserveConfiguration.");

  // 6. Check LToken and DebtToken MINTER_ROLE
  try {
    const LToken = await ethers.getContractAt("LTokenDAI", reserve.lToken, signer);
    const DebtToken = await ethers.getContractAt("DebtTokenDAI", reserve.debtToken, signer);

    const LToken_MINTER_ROLE = await LToken.MINTER_ROLE();
    const DebtToken_MINTER_ROLE = await DebtToken.MINTER_ROLE();

    const hasLTokenMinter = await LToken.hasRole(LToken_MINTER_ROLE, LENDING_POOL_ADDRESS);
    const hasDebtTokenMinter = await DebtToken.hasRole(DebtToken_MINTER_ROLE, LENDING_POOL_ADDRESS);

    console.log("LToken address:", reserve.lToken, "MINTER_ROLE granted to LendingPool:", hasLTokenMinter);
    console.log("DebtToken address:", reserve.debtToken, "MINTER_ROLE granted to LendingPool:", hasDebtTokenMinter);

    if (!hasLTokenMinter) throw new Error("❌ LendingPool does not have MINTER_ROLE on LToken.");
    if (!hasDebtTokenMinter) throw new Error("❌ LendingPool does not have MINTER_ROLE on DebtToken.");
  } catch (e) {
    console.error("❌ Error checking LToken/DebtToken MINTER_ROLE. Check contract addresses and ABIs.");
    throw e;
  }

  // 7. Simulate deposit
  try {
    const tx = await LendingPool.deposit(DAI_ADDRESS, DEPOSIT_AMOUNT);
    console.log("Successfully deposited the amount to the lending protocol:", tx.hash);
  } catch (err) {
    if (err && err.errorName) {
      console.error("Revert reason:", err.errorName);
    } else if (err && err.reason) {
      console.error("Revert reason:", err.reason);
    }
    console.dir(err, { depth: null });
    return;
  }
}

main().catch((error) => {
  console.error("Error running script:");
  console.error(error);
  process.exit(1);
});

// npx hardhat run scripts/testDeposit.js --network polygonAmoy