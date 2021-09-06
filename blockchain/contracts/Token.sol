//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  address private bankContract;

  modifier onlyBank() {
    require(msg.sender == bankContract, "Only the Bank can mint new Tokens!");
    _;
  }

  constructor(address _bankAddress) ERC20("Yield Token", "FREE"){
    bankContract = _bankAddress;
  }

  function mint(address to, uint256 amount) public onlyBank {
    _mint(to, amount);
  }
}