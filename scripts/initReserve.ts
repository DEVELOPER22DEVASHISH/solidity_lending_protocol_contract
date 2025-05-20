// import { ethers } from "hardhat";

// // Replace these with your actual deployed addresses (from your .env or deployment logs)
// const LENDING_POOL_ADDRESS = "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3";

// const DAI = {
//   asset: "0xD7b22F1e8705dA9019eb571B17eBCeeC8Df4f933",
//   lToken: "0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB",
//   debtToken: "0x896cD573F421f01aabA9762C99699B1A2e19911f",
// };
// const USDC = {
//   asset: "0x3434891fD32583E9BD2fA82A6f02aFa791d2710D",
//   lToken: "0x4E6f61A57444b1EDe74E87316d4721F35f414208",
//   debtToken: "0x5Ac6a22c619C9215fd7CAAC883Dd8801f07d4BD5",
// };
// const USDT = {
// //   asset: "0x0295EaA0A2477C5a073279f21CD1E4D843b89512",
//   lToken: "0x4935FAB2f0A7d83acDcd3f455607C45ddC739383",
//   debtToken: "0xaE6B6D63CC099EAc77D5FA63cd9567c98Ff4De39",
// };

// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log("Using deployer:", deployer.address);

//   const lendingPool = await ethers.getContractAt(
//     "LendingPool",
//     LENDING_POOL_ADDRESS,
//     deployer
//   );

//   // Helper to initialize a reserve
//   async function initReserve(asset: { asset: string; lToken: string; debtToken: string }) {
//     const tx = await lendingPool.initReserve(asset.asset, asset.lToken, asset.debtToken);
//     console.log(
//       `Initializing reserve for asset ${asset.asset} (lToken: ${asset.lToken}, debtToken: ${asset.debtToken})...`
//     );
//     await tx.wait();
//     console.log(`✅ Reserve initialized for ${asset.asset}`);
//   }

//   // Initialize all reserves
//   await initReserve(DAI);
//   await initReserve(USDC);
//   await initReserve(USDT);

//   console.log("All reserves initialized!");
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
