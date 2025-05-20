const { ethers } = require("hardhat");

const ADDRESSES = {
  LendingPool: "0x516Fd9AC1D9a99EE9e2dd0C5074dC8920c467D8C",
  ReserveConfig: "0xA6a5c6865fd7f34f8066695203201418c66751E6",
  DAI: {
    ERC20: "0xcf2A8631d4f14eB01e73813D4a7dB6238318ABE6",
    LToken: "0xb84796869790056B677ef8882B10FA2E4e1Ec2aa",        // LTokenDAI
    DebtToken: "0x0bC4b4ABD8797892b5F95B59FAda9d238d7cC9df",    // DebtTokenDAI
    Decimals: 18,
    Name: "DAI"
  },
  USDC: {
    ERC20: "0x0207e57106Bc422e97eA7B225a62c147b6304671",
    LToken: " 0xC9e5319410DAB80b989B03193fC570775855a0D9",      // LTokenUSDC
    DebtToken: "0xDAb2C25D576457F5d79181e6b8B67d36ad60fCED",    // DebtTokenUSDC
    Decimals: 6,
    Name: "USDC"
  },
  USDT: {
    ERC20: "0x4813a8fB4309853b8df25c74A59cea6Ebef42a1E",
    LToken: "0x1cE5644607962911647dBc9DD87c0A5A3B7A88B2",      // LTokenUSDT
    DebtToken: "0xc69825B375b7A53E72a6b8c764624ef9132F9643",    // DebtTokenUSDT
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