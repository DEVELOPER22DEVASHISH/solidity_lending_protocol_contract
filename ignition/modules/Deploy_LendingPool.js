const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LendingPoolModule", (m) => {
    const INTEREST_RATE_MODEL_ADDRESS = "0xF04FE514547128C320e4f6fFB614824291962D81";
    const COLLATERAL_MANAGER_ADDRESS = "0x993FC5F172280dCE3f9EF1622dF21718cc76835f";
    const RESERVE_CONFIG_ADDRESS = "0x2B8BbB6680853f54C0aB4185F424c1BF65e13473";

    const lendingPool = m.contract("LendingPool", [
        INTEREST_RATE_MODEL_ADDRESS,
        COLLATERAL_MANAGER_ADDRESS,
        RESERVE_CONFIG_ADDRESS
    ]);

    return { lendingPool };
});

// npx hardhat ignition deploy ./ignition/modules/Deploy_LendingPool.js --network polygonAmoy

// LendingPoolModule#LendingPool - 0x2846b408cF34154b4207A4c944701f1bdCA9DCC9