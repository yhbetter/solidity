pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Registable {
  ERC20 public registToken;

  bool public allowRegist = true;


  function Registable(ERC20 _token) public {
    registToken = _token;
  }

  modifier onlyRegister() {
    require(allowRegist);
    require(registToken.balanceOf(msg.sender) > 0);
    _;
  }








}
