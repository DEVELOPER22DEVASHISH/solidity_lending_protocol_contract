const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LendingPool.deposit (integration, using deployed contracts)", function () {
  // Replace these with your actual addresses
  const DAI_ADDRESS = "0xcf2A8631d4f14eB01e73813D4a7dB6238318ABE6";
  const LENDING_POOL_ADDRESS = "0x516Fd9AC1D9a99EE9e2dd0C5074dC8920c467D8C";
  const L_TOKEN_DAI_ADDRESS = "0xb84796869790056B677ef8882B10FA2E4e1Ec2aa";
  const DEPOSIT_AMOUNT = ethers.parseUnits("1.0", 18);

  let user, ERC20, LendingPool, LTokenDAI;

  before(async function () {
    [user] = await ethers.getSigners();
    ERC20 = await ethers.getContractAt("IERC20", DAI_ADDRESS, user);
    LendingPool = await ethers.getContractAt("LendingPool", LENDING_POOL_ADDRESS, user);
    LTokenDAI = await ethers.getContractAt("LTokenDAI", L_TOKEN_DAI_ADDRESS, user);
  });

  it("should deposit DAI and mint LTokenDAI", async function () {
    // Approve LendingPool to spend user's DAI
    const allowance = await ERC20.allowance(user.address, LENDING_POOL_ADDRESS);
    if (allowance < DEPOSIT_AMOUNT) {
      const approveTx = await ERC20.approve(LENDING_POOL_ADDRESS, DEPOSIT_AMOUNT);
      await approveTx.wait();
    }

    const balanceBefore = await ERC20.balanceOf(user.address);
    const lTokenBalanceBefore = await LTokenDAI.balanceOf(user.address);

    // Deposit
    const depositTx = await LendingPool.deposit(DAI_ADDRESS, DEPOSIT_AMOUNT);
    await depositTx.wait();
    console.log("Deposit transaction hash:", depositTx.hash);

    const balanceAfter = await ERC20.balanceOf(user.address);
    const lTokenBalanceAfter = await LTokenDAI.balanceOf(user.address);

    expect(balanceAfter).to.equal(balanceBefore - DEPOSIT_AMOUNT);
    expect(lTokenBalanceAfter).to.equal(lTokenBalanceBefore + DEPOSIT_AMOUNT);
  });
});



// npx hardhat test test/LandingPoolTest.js --network polygonAmoy