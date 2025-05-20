const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LendingPoolModuleV1", (m) => {
    const INTEREST_RATE_MODEL_ADDRESS = "0xCa99778D2f3eD84a794Ee17a529a07c721346f70";
    const COLLATERAL_MANAGER_ADDRESS = "0x583782Ba332A56DC10cd65c6Fe1786b949CD66A8";
    const RESERVE_CONFIG_ADDRESS = "0xA6a5c6865fd7f34f8066695203201418c66751E6";

    const lendingPool = m.contract("LendingPool", [
        INTEREST_RATE_MODEL_ADDRESS,
        COLLATERAL_MANAGER_ADDRESS,
        RESERVE_CONFIG_ADDRESS
    ]);

    return { lendingPool };
});

// npx hardhat ignition deploy ./ignition/modules/Deploy_LendingPool.js --network polygonAmoy

