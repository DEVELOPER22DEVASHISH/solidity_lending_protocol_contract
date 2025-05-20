
//  // npx hardhat run scripts/addReserve.js --network polygonAmoy

const { ethers } = require("hardhat");

const lendingPoolAddress = "0x516Fd9AC1D9a99EE9e2dd0C5074dC8920c467D8C";
const reserves = [
  {
    symbol: "USDC",
    asset: "0x0207e57106Bc422e97eA7B225a62c147b6304671",
    lToken: "0xC9e5319410DAB80b989B03193fC570775855a0D9",
    debtToken: "0xDAb2C25D576457F5d79181e6b8B67d36ad60fCED",
  },
  {
    symbol: "DAI",
    asset: "0xcf2A8631d4f14eB01e73813D4a7dB6238318ABE6",
    lToken: "0xb84796869790056B677ef8882B10FA2E4e1Ec2aa",
    debtToken: "0x0bC4b4ABD8797892b5F95B59FAda9d238d7cC9df",
  },
  {
    symbol: "USDT",
    asset: "0x4813a8fB4309853b8df25c74A59cea6Ebef42a1E",
    lToken: "0x1cE5644607962911647dBc9DD87c0A5A3B7A88B2",
    debtToken: "0xc69825B375b7A53E72a6b8c764624ef9132F9643",
  },
];

async function initReserve({ symbol, asset, lToken, debtToken }) {
  const [admin] = await ethers.getSigners();
  console.log(`Using admin: ${admin.address}`);

  const lendingPool = await ethers.getContractAt("LendingPool", lendingPoolAddress, admin);

  // Check admin role
  const ADMIN_ROLE = await lendingPool.ADMIN_ROLE();
  const hasRole = await lendingPool.hasRole(ADMIN_ROLE, admin.address);
  console.log(`Admin has ADMIN_ROLE: ${hasRole}`);
  if (!hasRole) {
    throw new Error("Admin does not have ADMIN_ROLE. Cannot initialize reserve.");
  }

  // Check if already initialized
  try {
    const reserveData = await lendingPool.reserves(asset);
    if (reserveData.isInitialized) {
      console.log(`⚠️ Reserve for ${symbol} already initialized.`);
      return;
    }
  } catch (e) {
    console.log(`Could not check isInitialized for ${symbol}:`, e.message);
  }

  // Try to initialize
  try {
    const tx = await lendingPool.initReserve(asset, lToken, debtToken);
    await tx.wait();
    console.log(`✅ Reserve for ${symbol} initialized!`);
  } catch (err) {
    console.error(`❌ Error initializing reserve for ${symbol}:`);
    console.dir(err, { depth: null });
  }
}

async function main() {
  for (const reserve of reserves) {
    await initReserve(reserve);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// npx hardhat run scripts/addReserve.js --network polygonAmoy