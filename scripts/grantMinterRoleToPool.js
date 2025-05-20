// const { ethers } = require("hardhat");

// const LENDING_POOL = "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3";
// const TOKENS = [
//   { symbol: "DAI", lToken: "0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB", debtToken: "0x896cD573F421f01aabA9762C99699B1A2e19911f" },
//   { symbol: "USDC", lToken: "0x4E6f61A57444b1EDe74E87316d4721F35f414208", debtToken: "0x5Ac6a22c619C9215fd7CAAC883Dd8801f07d4BD5" },
//   { symbol: "USDT", lToken: "0x4935FAB2f0A7d83acDcd3f455607C45ddC739383", debtToken: "0xaE6B6D63CC099EAc77D5FA63cd9567c98Ff4De39" },
// ];

// async function main() {
//   const [admin] = await ethers.getSigners();
//   const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
//   for (const { symbol, lToken, debtToken } of TOKENS) {
//     const ltoken = await ethers.getContractAt("LToken", lToken, admin);
//     const debttoken = await ethers.getContractAt("DebtToken", debtToken, admin);

//     try {
//       let tx = await ltoken.grantRole(MINTER_ROLE, LENDING_POOL);
//       await tx.wait();
//       console.log(`✅ Granted MINTER_ROLE to LendingPool for ${symbol} LToken`);
//     } catch (e) {
//       console.error(`⚠️ Could not grant MINTER_ROLE to LendingPool for ${symbol} LToken:`, e.message);
//     }

//     try {
//       let tx = await debttoken.grantRole(MINTER_ROLE, LENDING_POOL);
//       await tx.wait();
//       console.log(`✅ Granted MINTER_ROLE to LendingPool for ${symbol} DebtToken`);
//     } catch (e) {
//       console.error(`⚠️ Could not grant MINTER_ROLE to LendingPool for ${symbol} DebtToken:`, e.message);
//     }
//   }
// }

// main().catch(console.error);

// const { ethers } = require("hardhat");

// // LendingPool address
// const LENDING_POOL = "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3";

// // Asset-specific LToken and DebtToken addresses
// const TOKENS = [
//   {
//     symbol: "DAI",
//     lToken: "0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB",
//     debtToken: "0x896cD573F421f01aabA9762C99699B1A2e19911f",
//   },
//   {
//     symbol: "USDC",
//     lToken: "0x4E6f61A57444b1EDe74E87316d4721F35f414208",
//     debtToken: "0x5Ac6a22c619C9215fd7CAAC883Dd8801f07d4BD5",
//   },
//   {
//     symbol: "USDT",
//     lToken: "0x4935FAB2f0A7d83acDcd3f455607C45ddC739383",
//     debtToken: "0xaE6B6D63CC099EAc77D5FA63cd9567c98Ff4De39",
//   },
// ];

// async function main() {
//   const [admin] = await ethers.getSigners();
//   const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));

//   for (const { symbol, lToken, debtToken } of TOKENS) {
//     // Grant MINTER_ROLE for LToken
//     try {
//       const lTokenContract = await ethers.getContractAt("LToken", lToken, admin);
//       const hasMinter = await lTokenContract.hasRole(MINTER_ROLE, LENDING_POOL);
//       if (!hasMinter) {
//         // Use the addMinter function (onlyAdmin) from your contract
//         const tx = await lTokenContract.addMinter(LENDING_POOL);
//         await tx.wait();
//         console.log(`✅ Granted MINTER_ROLE to LendingPool for ${symbol} LToken`);
//       } else {
//         console.log(`⚠️ LendingPool already has MINTER_ROLE for ${symbol} LToken`);
//       }
//     } catch (e) {
//       console.error(`❌ Error granting MINTER_ROLE to LendingPool for ${symbol} LToken:`, e.reason || e.message);
//     }

//     // Grant MINTER_ROLE for DebtToken
//     try {
//       const debtTokenContract = await ethers.getContractAt("DebtToken", debtToken, admin);
//       const hasMinter = await debtTokenContract.hasRole(MINTER_ROLE, LENDING_POOL);
//       if (!hasMinter) {
//         // Use the addMinter function (onlyAdmin) from your contract
//         const tx = await debtTokenContract.addMinter(LENDING_POOL);
//         await tx.wait();
//         console.log(`✅ Granted MINTER_ROLE to LendingPool for ${symbol} DebtToken`);
//       } else {
//         console.log(`⚠️ LendingPool already has MINTER_ROLE for ${symbol} DebtToken`);
//       }
//     } catch (e) {
//       console.error(`❌ Error granting MINTER_ROLE to LendingPool for ${symbol} DebtToken:`, e.reason || e.message);
//     }
//   }
// }

// main().catch(console.error);
const { ethers } = require("hardhat");

// LendingPool address
const LENDING_POOL = "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3";

// Asset-specific LToken and DebtToken addresses
const TOKENS = [
  {
    symbol: "DAI",
    lToken: "0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB",      // LTokenDAI
    debtToken: "0x896cD573F421f01aabA9762C99699B1A2e19911f",    // DebtTokenDAI
  },
  {
    symbol: "USDC",
    lToken: "0x4E6f61A57444b1EDe74E87316d4721F35f414208",      // LTokenUSDC
    debtToken: "0x5Ac6a22c619C9215fd7CAAC883Dd8801f07d4BD5",    // DebtTokenUSDC
  },
  {
    symbol: "USDT",
    lToken: "0x4935FAB2f0A7d83acDcd3f455607C45ddC739383",      // LTokenUSDT
    debtToken: "0xaE6B6D63CC099EAc77D5FA63cd9567c98Ff4De39",    // DebtTokenUSDT
  }
];

async function main() {
  const [admin] = await ethers.getSigners();

  for (const { symbol, lToken, debtToken } of TOKENS) {
    // Grant MINTER_ROLE for LToken
    try {
      const lTokenContract = await ethers.getContractAt("LToken", lToken, admin);
      const tx = await lTokenContract.addMinter(LENDING_POOL);
      await tx.wait();
      console.log(`✅ Granted MINTER_ROLE to LendingPool for ${symbol} LToken`);
    } catch (e) {
      console.error(`❌ Error granting MINTER_ROLE to LendingPool for ${symbol} LToken:`, e.reason || e.message);
    }

    // Grant MINTER_ROLE for DebtToken
    try {
      const debtTokenContract = await ethers.getContractAt("DebtToken", debtToken, admin);
      const tx = await debtTokenContract.addMinter(LENDING_POOL);
      await tx.wait();
      console.log(`✅ Granted MINTER_ROLE to LendingPool for ${symbol} DebtToken`);
    } catch (e) {
      console.error(`❌ Error granting MINTER_ROLE to LendingPool for ${symbol} DebtToken:`, e.reason || e.message);
    }
  }
}

main().catch(console.error);


// npx hardhat run scripts/grantMinterRoleToPool.js --network polygonAmoy
      