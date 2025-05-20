// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("LendingPool deposit function", function () {
//   let deployer, user;
//   let LendingPool, ReserveConfiguration, InterestRateModel, CollateralManager;
//   let lendingPool, reserveConfig, interestModel, collateralManager;
//   let LToken, DebtToken, lToken, debtToken;
//   let ERC20Mock, dai;

//   beforeEach(async function () {
//     [deployer, user] = await ethers.getSigners();

//     // 1. Deploy mock ERC20 token (DAI)
//     ERC20Mock = await ethers.getContractFactory("ERC20Mock");
//     dai = await ERC20Mock.deploy("Mock DAI", "DAI", deployer.address, ethers.parseUnits("1000000", 18));
//     await dai.waitForDeployment();

//     // 2. Deploy InterestRateModel, CollateralManager, ReserveConfiguration
//     InterestRateModel = await ethers.getContractFactory("InterestRateModel");
//     interestModel = await InterestRateModel.deploy();
//     await interestModel.waitForDeployment();

//     CollateralManager = await ethers.getContractFactory("CollateralManager");
//     collateralManager = await CollateralManager.deploy();
//     await collateralManager.waitForDeployment();

//     ReserveConfiguration = await ethers.getContractFactory("ReserveConfiguration");
//     reserveConfig = await ReserveConfiguration.deploy();
//     await reserveConfig.waitForDeployment();

//     // 3. Deploy LendingPool
//     LendingPool = await ethers.getContractFactory("LendingPool");
//     lendingPool = await LendingPool.deploy(
//       await interestModel.getAddress(),
//       await collateralManager.getAddress(),
//       await reserveConfig.getAddress()
//     );
//     await lendingPool.waitForDeployment();

//     // 4. Deploy LToken and DebtToken for DAI
//     LToken = await ethers.getContractFactory("LToken");
//     lToken = await LToken.deploy("Mock lDAI", "lDAI", lendingPool.target);
//     await lToken.waitForDeployment();

//     DebtToken = await ethers.getContractFactory("DebtToken");
//     debtToken = await DebtToken.deploy("Mock debtDAI", "debtDAI", lendingPool.target);
//     await debtToken.waitForDeployment();
//   });

//   it("should revert deposit if reserve is not initialized", async function () {
//     await expect(
//       lendingPool.deposit(await dai.getAddress(), ethers.parseUnits("1", 18))
//     ).to.be.reverted;
//   });

//   it("should revert deposit if reserve is not active", async function () {
//     // Set config for DAI (isActive = false)
//     await reserveConfig.setConfig(
//       await dai.getAddress(),
//       ethers.parseUnits("0.8", 18), // ltv
//       ethers.parseUnits("0.85", 18), // liquidationThreshold
//       ethers.parseUnits("1.08", 18), // liquidationBonus
//       false // isActive
//     );
//     // Initialize reserve
//     await lendingPool.initReserve(
//       await dai.getAddress(),
//       await lToken.getAddress(),
//       await debtToken.getAddress()
//     );
//     // Now deposit should revert (not active)
//     await expect(
//       lendingPool.deposit(await dai.getAddress(), ethers.parseUnits("1", 18))
//     ).to.be.reverted;
//   });

//   it("should allow deposit after reserve is initialized and active", async function () {
//     // Set config for DAI (isActive = true)
//     await reserveConfig.setConfig(
//       await dai.getAddress(),
//       ethers.parseUnits("0.8", 18), // ltv
//       ethers.parseUnits("0.85", 18), // liquidationThreshold
//       ethers.parseUnits("1.08", 18), // liquidationBonus
//       true // isActive
//     );
//     // Initialize reserve
//     await lendingPool.initReserve(
//       await dai.getAddress(),
//       await lToken.getAddress(),
//       await debtToken.getAddress()
//     );
//     // Approve LendingPool to spend DAI
//     await dai.approve(await lendingPool.getAddress(), ethers.parseUnits("10", 18));
//     // Deposit
//     await expect(
//       lendingPool.deposit(await dai.getAddress(), ethers.parseUnits("1", 18))
//     ).to.emit(lendingPool, "Deposit");
//   });

//   it("should revert deposit if LendingPool is paused", async function () {
//     // Set config and initialize reserve (active)
//     await reserveConfig.setConfig(
//       await dai.getAddress(),
//       ethers.parseUnits("0.8", 18),
//       ethers.parseUnits("0.85", 18),
//       ethers.parseUnits("1.08", 18),
//       true
//     );
//     await lendingPool.initReserve(
//       await dai.getAddress(),
//       await lToken.getAddress(),
//       await debtToken.getAddress()
//     );
//     await dai.approve(await lendingPool.getAddress(), ethers.parseUnits("10", 18));
//     // Pause pool
//     await lendingPool.pause();
//     await expect(
//       lendingPool.deposit(await dai.getAddress(), ethers.parseUnits("1", 18))
//     ).to.be.reverted;
//     await lendingPool.unpause();
//   });

//   it("should revert deposit if allowance is not enough", async function () {
//     // Set config and initialize reserve (active)
//     await reserveConfig.setConfig(
//       await dai.getAddress(),
//       ethers.parseUnits("0.8", 18),
//       ethers.parseUnits("0.85", 18),
//       ethers.parseUnits("1.08", 18),
//       true
//     );
//     await lendingPool.initReserve(
//       await dai.getAddress(),
//       await lToken.getAddress(),
//       await debtToken.getAddress()
//     );
//     // No approve
//     await expect(
//       lendingPool.deposit(await dai.getAddress(), ethers.parseUnits("1", 18))
//     ).to.be.reverted;
//   });
// });

// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// const ADDRESSES = {
//   LendingPool: "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3",
//   ReserveConfiguration: "0x2B8BbB6680853f54C0aB4185F424c1BF65e13473",
//   LToken: {
//     DAI: "0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB",
//     USDC: "0x4E6f61A57444b1EDe74E87316d4721F35f414208",
//     USDT: "0x4935FAB2f0A7d83acDcd3f455607C45ddC739383",
//   },
//   DebtToken: {
//     DAI: "0x896cD573F421f01aabA9762C99699B1A2e19911f",
//     USDC: "0x5Ac6a22c619C9215fd7CAAC883Dd8801f07d4BD5",
//     USDT: "0xaE6B6D63CC099EAc77D5FA63cd9567c98Ff4De39",
//   },
//   MockToken: {
//     DAI: "0xD7b22F1e8705dA9019eb571B17eBCeeC8Df4f933",
//     USDC: "0x3434891fD32583E9BD2fA82A6f02aFa791d2710D",
//     USDT: "0x0295EaA0A2477C5a073279f21CD1E4D843b89512",
//   }
// };

// // Helper: decimals for each token
// const DECIMALS = {
//   DAI: 18,
//   USDC: 6,
//   USDT: 6
// };

// async function ensureReserveInitialized(lendingPool, reserveConfig, symbol) {
//   const asset = ADDRESSES.MockToken[symbol];
//   const lToken = ADDRESSES.LToken[symbol];
//   const debtToken = ADDRESSES.DebtToken[symbol];

//   // Check if already initialized
//   const reserve = await lendingPool.reserves(asset);
//   if (!reserve.isInitialized) {
//     await lendingPool.initReserve(asset, lToken, debtToken);
//   }

//   // Check config is active, if not, set it (assumes setConfig signature)
//   const config = await reserveConfig.getConfig(asset);
//   if (!config.isActive) {
//     // Use previous config values or set reasonable defaults
//     await reserveConfig.setConfig(
//       asset,
//       config.ltv || ethers.parseUnits("0.8", 18),
//       config.liquidationThreshold || ethers.parseUnits("0.85", 18),
//       config.liquidationBonus || ethers.parseUnits("1.08", 18),
//       true // isActive
//     );
//   }
// }

// describe("LendingPool deposit function (deployed contracts)", function () {
//   let deployer, user;
//   let lendingPool, reserveConfig, dai, usdc, usdt;

//   before(async function () {
//     [deployer, user] = await ethers.getSigners();

//     lendingPool = await ethers.getContractAt("LendingPool", ADDRESSES.LendingPool, deployer);
//     reserveConfig = await ethers.getContractAt("ReserveConfiguration", ADDRESSES.ReserveConfiguration, deployer);
//     dai = await ethers.getContractAt("IERC20", ADDRESSES.MockToken.DAI, deployer);
//     usdc = await ethers.getContractAt("IERC20", ADDRESSES.MockToken.USDC, deployer);
//     usdt = await ethers.getContractAt("IERC20", ADDRESSES.MockToken.USDT, deployer);
//   });

//   it("should initialize DAI reserve and allow deposit", async function () {
//     const symbol = "DAI";
//     const asset = ADDRESSES.MockToken[symbol];
//     const decimals = DECIMALS[symbol];
//     const amount = ethers.parseUnits("1", decimals);

//     // Ensure reserve is initialized and active
//     await ensureReserveInitialized(lendingPool, reserveConfig, symbol);

//     // Fund user if needed
//     if ((await dai.balanceOf(user.address)) < amount) {
//       await dai.transfer(user.address, amount);
//     }

//     // Approve LendingPool
//     await dai.connect(user).approve(ADDRESSES.LendingPool, amount);

//     // Deposit
//     await expect(
//       lendingPool.connect(user).deposit(asset, amount)
//     ).to.emit(lendingPool, "Deposit");
//   });

//   it("should initialize USDC reserve and allow deposit", async function () {
//     const symbol = "USDC";
//     const asset = ADDRESSES.MockToken[symbol];
//     const decimals = DECIMALS[symbol];
//     const amount = ethers.parseUnits("1", decimals);

//     await ensureReserveInitialized(lendingPool, reserveConfig, symbol);

//     if ((await usdc.balanceOf(user.address)) < amount) {
//       await usdc.transfer(user.address, amount);
//     }
//     await usdc.connect(user).approve(ADDRESSES.LendingPool, amount);

//     await expect(
//       lendingPool.connect(user).deposit(asset, amount)
//     ).to.emit(lendingPool, "Deposit");
//   });

//   it("should initialize USDT reserve and allow deposit", async function () {
//     const symbol = "USDT";
//     const asset = ADDRESSES.MockToken[symbol];
//     const decimals = DECIMALS[symbol];
//     const amount = ethers.parseUnits("1", decimals);

//     await ensureReserveInitialized(lendingPool, reserveConfig, symbol);

//     if ((await usdt.balanceOf(user.address)) < amount) {
//       await usdt.transfer(user.address, amount);
//     }
//     await usdt.connect(user).approve(ADDRESSES.LendingPool, amount);

//     await expect(
//       lendingPool.connect(user).deposit(asset, amount)
//     ).to.emit(lendingPool, "Deposit");
//   });

//   it("should revert deposit if reserve is not active", async function () {
//     const symbol = "DAI";
//     const asset = ADDRESSES.MockToken[symbol];
//     const decimals = DECIMALS[symbol];
//     const amount = ethers.parseUnits("1", decimals);

//     // Set reserve to inactive
//     const config = await reserveConfig.getConfig(asset);
//     await reserveConfig.setConfig(
//       asset,
//       config.ltv,
//       config.liquidationThreshold,
//       config.liquidationBonus,
//       false // isActive
//     );

//     await expect(
//       lendingPool.connect(user).deposit(asset, amount)
//     ).to.be.reverted;

//     // Restore active for other tests
//     await reserveConfig.setConfig(
//       asset,
//       config.ltv,
//       config.liquidationThreshold,
//       config.liquidationBonus,
//       true
//     );
//   });

//   it("should revert deposit if LendingPool is paused", async function () {
//     const symbol = "DAI";
//     const asset = ADDRESSES.MockToken[symbol];
//     const decimals = DECIMALS[symbol];
//     const amount = ethers.parseUnits("1", decimals);

//     // Pause pool
//     await lendingPool.pause();

//     await expect(
//       lendingPool.connect(user).deposit(asset, amount)
//     ).to.be.reverted;

//     await lendingPool.unpause();
//   });

//   it("should revert if allowance is not enough", async function () {
//     const symbol = "DAI";
//     const asset = ADDRESSES.MockToken[symbol];
//     const decimals = DECIMALS[symbol];
//     const amount = ethers.parseUnits("1", decimals);

//     // Remove approval
//     await dai.connect(user).approve(ADDRESSES.LendingPool, 0);

//     await expect(
//       lendingPool.connect(user).deposit(asset, amount)
//     ).to.be.reverted;
//   });
// });
// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// const ADDRESSES = {
//   LendingPool: "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3",
//   ReserveConfiguration: "0x2B8BbB6680853f54C0aB4185F424c1BF65e13473",
//   LToken: {
//     DAI: "0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB",
//     USDC: "0x4E6f61A57444b1EDe74E87316d4721F35f414208",
//     USDT: "0x4935FAB2f0A7d83acDcd3f455607C45ddC739383",
//   },
//   DebtToken: {
//     DAI: "0x896cD573F421f01aabA9762C99699B1A2e19911f",
//     USDC: "0x5Ac6a22c619C9215fd7CAAC883Dd8801f07d4BD5",
//     USDT: "0xaE6B6D63CC099EAc77D5FA63cd9567c98Ff4De39",
//   },
//   MockToken: {
//     DAI: "0xD7b22F1e8705dA9019eb571B17eBCeeC8Df4f933",
//     USDC: "0x3434891fD32583E9BD2fA82A6f02aFa791d2710D",
//     USDT: "0x0295EaA0A2477C5a073279f21CD1E4D843b89512",
//   },
// };

// const DECIMALS = {
//   DAI: 18,
//   USDC: 6,
//   USDT: 6,
// };

// async function ensureReserveInitialized(lendingPool, reserveConfig, symbol) {
//   const asset = ADDRESSES.MockToken[symbol];
//   const lToken = ADDRESSES.LToken[symbol];
//   const debtToken = ADDRESSES.DebtToken[symbol];

//   const reserve = await lendingPool.reserves(asset);
//   if (!reserve.isInitialized) {
//     await lendingPool.initReserve(asset, lToken, debtToken);
//   }

//   const config = await reserveConfig.getConfig(asset);
//   if (!config.isActive) {
//     await reserveConfig.setConfig(
//       asset,
//       config.ltv || ethers.parseUnits("0.8", 18),
//       config.liquidationThreshold || ethers.parseUnits("0.85", 18),
//       config.liquidationBonus || ethers.parseUnits("1.08", 18),
//       true
//     );
//   }
// }

// describe("LendingPool deposit function (deployed contracts)", function () {
//   let deployer, user;
//   let lendingPool, reserveConfig, dai, usdc, usdt;

//   before(async function () {
//     const provider = ethers.provider;
//     deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
//     user = deployer; // Using the same account for simplicity

//     lendingPool = await ethers.getContractAt("LendingPool", ADDRESSES.LendingPool, deployer);
//     reserveConfig = await ethers.getContractAt("ReserveConfiguration", ADDRESSES.ReserveConfiguration, deployer);
//     dai = await ethers.getContractAt("IERC20", ADDRESSES.MockToken.DAI, deployer);
//     usdc = await ethers.getContractAt("IERC20", ADDRESSES.MockToken.USDC, deployer);
//     usdt = await ethers.getContractAt("IERC20", ADDRESSES.MockToken.USDT, deployer);
//   });

//   it("should initialize DAI reserve and allow deposit", async function () {
//     const symbol = "DAI";
//     const asset = ADDRESSES.MockToken[symbol];
//     const decimals = DECIMALS[symbol];
//     const amount = ethers.parseUnits("1", decimals);

//     await ensureReserveInitialized(lendingPool, reserveConfig, symbol);

//     const balance = await dai.balanceOf(user.address);
//     if (balance < amount) {
//       await dai.transfer(user.address, amount);
//     }

//     await dai.connect(user).approve(ADDRESSES.LendingPool, amount);

//     await expect(
//       lendingPool.connect(user).deposit(asset, amount)
//     ).to.emit(lendingPool, "Deposit");
//   });

//   // Repeat similar tests for USDC and USDT

//   it("should revert deposit if reserve is not active", async function () {
//     const symbol = "DAI";
//     const asset = ADDRESSES.MockToken[symbol];
//     const decimals = DECIMALS[symbol];
//     const amount = ethers.parseUnits("1", decimals);

//     const config = await reserveConfig.getConfig(asset);
//     await reserveConfig.setConfig(
//       asset,
//       config.ltv,
//       config.liquidationThreshold,
//       config.liquidationBonus,
//       false
//     );

//     await expect(
//       lendingPool.connect(user).deposit(asset, amount)
//     ).to.be.reverted;

//     await reserveConfig.setConfig(
//       asset,
//       config.ltv,
//       config.liquidationThreshold,
//       config.liquidationBonus,
//       true
//     );
//   });

//   it("should revert deposit if LendingPool is paused", async function () {
//     const symbol = "DAI";
//     const asset = ADDRESSES.MockToken[symbol];
//     const decimals = DECIMALS[symbol];
//     const amount = ethers.parseUnits("1", decimals);

//     await lendingPool.pause();

//     await expect(
//       lendingPool.connect(user).deposit(asset, amount)
//     ).to.be.reverted;

//     await lendingPool.unpause();
//   });

//   it("should revert if allowance is not enough", async function () {
//     const symbol = "DAI";
//     const asset = ADDRESSES.MockToken[symbol];
//     const decimals = DECIMALS[symbol];
//     const amount = ethers.parseUnits("1", decimals);

//     await dai.connect(user).approve(ADDRESSES.LendingPool, 0);

//     await expect(
//       lendingPool.connect(user).deposit(asset, amount)
//     ).to.be.reverted;
//   });
// });

const { expect } = require("chai");
const { ethers } = require("hardhat");

const ADDRESSES = {
  LendingPool: "0xBBbD25711460Af780A38EBc278BAA1df6d33fca3",
  ReserveConfiguration: "0x2B8BbB6680853f54C0aB4185F424c1BF65e13473",
  LToken: {
    DAI: "0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB",
  },
  DebtToken: {
    DAI: "0x896cD573F421f01aabA9762C99699B1A2e19911f",
  },
  MockToken: {
    DAI: "0xD7b22F1e8705dA9019eb571B17eBCeeC8Df4f933",
  },
};

const DECIMALS = {
  DAI: 18,
};

async function ensureReserveInitialized(lendingPool, reserveConfig, symbol, deployer) {
  const asset = ADDRESSES.MockToken[symbol];
  const lToken = ADDRESSES.LToken[symbol];
  const debtToken = ADDRESSES.DebtToken[symbol];

  // Grant ADMIN_ROLE if needed
  const ADMIN_ROLE = await lendingPool.ADMIN_ROLE();
  const hasRole = await lendingPool.hasRole(ADMIN_ROLE, deployer.address);
  if (!hasRole) {
    await lendingPool.grantRole(ADMIN_ROLE, deployer.address);
  }

  // Initialize reserve if not already
  const reserve = await lendingPool.reserves(asset);
  if (!reserve.isInitialized) {
    await lendingPool.initReserve(asset, lToken, debtToken);
  }

  // Set config to active with valid parameters
  await reserveConfig.setConfig(
    asset,
    ethers.parseUnits("0.8", 18), // ltv
    ethers.parseUnits("0.85", 18), // liquidationThreshold
    ethers.parseUnits("1.08", 18), // liquidationBonus
    true // isActive
  );
}

describe("LendingPool deposit function (deployed contracts)", function () {
  let deployer, user;
  let lendingPool, reserveConfig, dai;

  before(async function () {
    // Use the first account as deployer and user for simplicity
    [deployer] = await ethers.getSigners();
    user = deployer; // For real tests, use a different user

    lendingPool = await ethers.getContractAt("LendingPool", ADDRESSES.LendingPool, deployer);
    reserveConfig = await ethers.getContractAt("ReserveConfiguration", ADDRESSES.ReserveConfiguration, deployer);
    dai = await ethers.getContractAt("IERC20", ADDRESSES.MockToken.DAI, deployer);
  });

  it("should initialize DAI reserve and allow deposit", async function () {
    const symbol = "DAI";
    const asset = ADDRESSES.MockToken[symbol];
    const decimals = DECIMALS[symbol];
    const amount = ethers.parseUnits("1", decimals);

    // Ensure reserve is initialized and active
    await ensureReserveInitialized(lendingPool, reserveConfig, symbol, deployer);

    // Mint tokens to user if needed (assumes mint function exists)
    let balance = await dai.balanceOf(user.address);
    if (balance < amount) {
      // If your MockDAI does not have mint, transfer from deployer or skip this step
      if (dai.mint) {
        await dai.mint(user.address, amount);
      } else {
        throw new Error("User has insufficient DAI and mint is not available.");
      }
    }

    // Approve LendingPool
    await dai.connect(user).approve(ADDRESSES.LendingPool, amount);

    // Deposit
    await expect(
      lendingPool.connect(user).deposit(asset, amount)
    ).to.emit(lendingPool, "Deposit");
  });

  it("should revert deposit if reserve is not active", async function () {
    const symbol = "DAI";
    const asset = ADDRESSES.MockToken[symbol];
    const decimals = DECIMALS[symbol];
    const amount = ethers.parseUnits("1", decimals);

    // Ensure reserve is initialized and active
    await ensureReserveInitialized(lendingPool, reserveConfig, symbol, deployer);

    // Set reserve to inactive
    await reserveConfig.setConfig(
      asset,
      ethers.parseUnits("0.8", 18),
      ethers.parseUnits("0.85", 18),
      ethers.parseUnits("1.08", 18),
      false // isActive
    );

    await expect(
      lendingPool.connect(user).deposit(asset, amount)
    ).to.be.reverted;

    // Restore active for other tests
    await reserveConfig.setConfig(
      asset,
      ethers.parseUnits("0.8", 18),
      ethers.parseUnits("0.85", 18),
      ethers.parseUnits("1.08", 18),
      true
    );
  });

  it("should revert deposit if LendingPool is paused", async function () {
    const symbol = "DAI";
    const asset = ADDRESSES.MockToken[symbol];
    const decimals = DECIMALS[symbol];
    const amount = ethers.parseUnits("1", decimals);

    // Ensure reserve is initialized and active
    await ensureReserveInitialized(lendingPool, reserveConfig, symbol, deployer);

    // Pause pool
    await lendingPool.pause();

    await expect(
      lendingPool.connect(user).deposit(asset, amount)
    ).to.be.reverted;

    await lendingPool.unpause();
  });

  it("should revert if allowance is not enough", async function () {
    const symbol = "DAI";
    const asset = ADDRESSES.MockToken[symbol];
    const decimals = DECIMALS[symbol];
    const amount = ethers.parseUnits("1", decimals);

    // Ensure reserve is initialized and active
    await ensureReserveInitialized(lendingPool, reserveConfig, symbol, deployer);

    // Remove approval
    await dai.connect(user).approve(ADDRESSES.LendingPool, 0);

    await expect(
      lendingPool.connect(user).deposit(asset, amount)
    ).to.be.reverted;
  });
});



// npx hardhat test test/LandingPoolTest.js --network polygonAmoy