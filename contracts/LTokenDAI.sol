// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LTokenDAI is ERC20 {
    constructor() ERC20("LToken DAI", "lDAI") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
