pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract BlockRecharge is Ownable {

  uint256 rate;

  function BlockRecharge() public{
      rate = 0;
  }

  function setRate(uint256 _rate) public onlyOwner{
      rate = _rate;
  }


  function calcRate(uint256 amount) internal view  returns(uint256 val) {
      require(amount > 0);
      val =  (amount * rate ) / 1000;
  }
}
