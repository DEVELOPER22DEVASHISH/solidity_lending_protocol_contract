const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LendingPoolModuleV2", (m) => {
    const INTEREST_RATE_MODEL_ADDRESS = "0xF04FE514547128C320e4f6fFB614824291962D81";
    const COLLATERAL_MANAGER_ADDRESS = "0x6899d1a6f9F18dfFe9E623Ad46b47620143a3dBb";
    const RESERVE_CONFIG_ADDRESS = "0x2B8BbB6680853f54C0aB4185F424c1BF65e13473";

    const lendingPool = m.contract("LendingPool", [
        INTEREST_RATE_MODEL_ADDRESS,
        COLLATERAL_MANAGER_ADDRESS,
        RESERVE_CONFIG_ADDRESS
    ]);

    return { lendingPool };
});

// npx hardhat ignition deploy ./ignition/modules/Deploy_LendingPool.js --network polygonAmoy

