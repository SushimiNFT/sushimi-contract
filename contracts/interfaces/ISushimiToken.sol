// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.0;

interface ISushimiToken is IERC20 {
    function burnFrom(
        address from,
        uint256 amount
    ) external;
}