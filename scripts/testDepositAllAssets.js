const { ethers } = require("hardhat");

const ADDRESSES = {
  LendingPool: "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3",
  ReserveConfig: "0x2B8BbB6680853f54C0aB4185F424c1BF65e13473",
  DAI: {
    ERC20: "0xD7b22F1e8705dA9019eb571B17eBCeeC8Df4f933",
    LToken: "0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB",        // LTokenDAI
    DebtToken: "0x896cD573F421f01aabA9762C99699B1A2e19911f",    // DebtTokenDAI
    Decimals: 18,
    Name: "DAI"
  },
  USDC: {
    ERC20: "0x3434891fD32583E9BD2fA82A6f02aFa791d2710D",
    LToken: "0x4E6f61A57444b1EDe74E87316d4721F35f414208",      // LTokenUSDC
    DebtToken: "0x5Ac6a22c619C9215fd7CAAC883Dd8801f07d4BD5",    // DebtTokenUSDC
    Decimals: 6,
    Name: "USDC"
  },
  USDT: {
    ERC20: "0x0295EaA0A2477C5a073279f21CD1E4D843b89512",
    LToken: "0x4935FAB2f0A7d83acDcd3f455607C45ddC739383",      // LTokenUSDT
    DebtToken: "0xaE6B6D63CC099EAc77D5FA63cd9567c98Ff4De39",    // DebtTokenUSDT
    Decimals: 6,
    Name: "USDT"
  }
};

async function logTokenInfo(tokenName, contract) {
  try {
    console.log(`${tokenName} name:   `, await contract.name());
    console.log(`${tokenName} symbol: `, await contract.symbol());
    console.log(`${tokenName} supply: `, (await contract.totalSupply()).toString());
  } catch (e) {
    console.error(`Error reading ${tokenName}:`, e.message);
  }
}

async function testDepositForAsset(assetKey, signer, LendingPool, ReserveConfig) {
  const asset = ADDRESSES[assetKey];
  const ERC20 = await ethers.getContractAt("IERC20", asset.ERC20, signer);
  const LToken = await ethers.getContractAt("LToken", asset.LToken, signer);
  const DebtToken = await ethers.getContractAt("DebtToken", asset.DebtToken, signer);

  // Print all addresses
  console.log(`\n======== ${asset.Name} ========`);
  console.log("ERC20:      ", asset.ERC20);
  console.log("LToken:     ", asset.LToken);
  console.log("DebtToken:  ", asset.DebtToken);

  // Print reserve data
  const reserve = await LendingPool.reserves(asset.ERC20);
  console.log("isInitialized: ", reserve.isInitialized);
  console.log("lToken:        ", reserve.lToken);
  console.log("debtToken:     ", reserve.debtToken);

  // Print reserve config
  const config = await ReserveConfig.getConfig(asset.ERC20);
  console.log("isActive:      ", config.isActive);
  console.log("ltv:           ", config.ltv?.toString());
  console.log("liqThreshold:  ", config.liquidationThreshold?.toString());
  console.log("liqBonus:      ", config.liquidationBonus?.toString());

  // Print LToken and DebtToken info
  await logTokenInfo(`${asset.Name} LToken`, LToken);
  await logTokenInfo(`${asset.Name} DebtToken`, DebtToken);

  // Print balance and allowance
  const balance = await ERC20.balanceOf(signer.address);
  const allowance = await ERC20.allowance(signer.address, ADDRESSES.LendingPool);
  console.log("User balance:  ", ethers.formatUnits(balance, asset.Decimals));
  console.log("User allowance:", ethers.formatUnits(allowance, asset.Decimals));

  // Approve if needed
  const depositAmount = ethers.parseUnits("1.0", asset.Decimals);
  if (allowance < depositAmount) {
    const tx = await ERC20.approve(ADDRESSES.LendingPool, depositAmount);
    await tx.wait();
    console.log("✅ Approved 1.0", asset.Name, "for LendingPool");
  }

  // Check LendingPool paused
  const paused = await LendingPool.paused();
  console.log("LendingPool paused:", paused);

  // --- Attempt Deposit ---
  if (!reserve.isInitialized) {
    console.error(`❌ Reserve is not initialized for ${asset.Name}.`);
    return;
  }
  if (!config.isActive) {
    console.error(`❌ Reserve is not active for ${asset.Name}.`);
    return;
  }
  if (paused) {
    console.error("❌ LendingPool is paused. Unpause before deposit.");
    return;
  }
  if (balance < depositAmount) {
    console.error(`❌ Not enough ${asset.Name} balance.`);
    return;
  }

  try {
    const tx = await LendingPool.deposit(asset.ERC20, depositAmount);
    await tx.wait();
    console.log(`✅ Deposit of 1.0 ${asset.Name} successful!`);
  } catch (e) {
    console.error(`❌ Deposit failed for ${asset.Name}:`);
    console.dir(e, { depth: null });
  }
}

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Using signer:", signer.address);

  const LendingPool = await ethers.getContractAt("LendingPool", ADDRESSES.LendingPool, signer);
  const ReserveConfig = await ethers.getContractAt("ReserveConfiguration", ADDRESSES.ReserveConfig, signer);

  // Print LendingPool dependencies if available
  try {
    if (LendingPool.interestModel) {
      console.log("InterestModel:    ", await LendingPool.interestModel());
    }
    if (LendingPool.collateralManager) {
      console.log("CollateralManager:", await LendingPool.collateralManager());
    }
    if (LendingPool.reserveConfig) {
      console.log("ReserveConfig:    ", await LendingPool.reserveConfig());
    }
  } catch (e) {
    // ignore if not implemented
  }

  // Test deposit for each asset
  for (const assetKey of ["DAI", "USDC", "USDT"]) {
    await testDepositForAsset(assetKey, signer, LendingPool, ReserveConfig);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// npx hardhat run scripts/testDepositAllAssets.js --network polygonAmoy