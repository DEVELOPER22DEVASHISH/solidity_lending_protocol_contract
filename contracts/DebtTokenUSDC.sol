// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DebtTokenUSDC is ERC20 {
    constructor() ERC20("DebtToken USDC", "dUSDC") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
