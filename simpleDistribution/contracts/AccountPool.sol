pragma solidity ^0.4.17;

import "./utils/Version.sol";
import "./utils/HasNoEth.sol";
import "./utils/Registable.sol";
import "./AgentAccount.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


contract AccountPool  is Registable,Version,HasNoEth {


   using SafeMath for uint;

    uint public  defaultCount;
    uint public  validCount;
    mapping(address=>uint) public sellCount;

    uint public singlePrice;

    constructor(ERC20 token,uint _defaultCount,uint _validCount,uint _singlePirce) public Registable(token) {
      defaultCount = _defaultCount;
      validCount = _validCount;
      singlePrice = _singlePirce;
    }

    function blockVersion() constant  public returns (string version){
      version = "AccountPool.1.0";
    }

    function buy(uint count) public payable {
      require(msg.value >= count.mul(singlePrice));
      sellCount[msg.sender] += count;
    }

    function getHoldCount(address adr) constant public returns(uint) {
      uint dCount = 0;
      if(registToken.balanceOf(adr) > 0){
        dCount = validCount;
      }else{
        dCount = defaultCount;
      }
      return dCount + sellCount[adr];
    }


    function sell(address[] _as, uint[] cs ) public onlyOwner {
      for (uint j = 0; j < _as.length; j++) {
          address ads = _as[j];
          uint256 count =cs[j];
          sellCount[ads] += count;
      }
    }


    function setDefaultCount(uint _defaultCount ) public onlyOwner {
      defaultCount = _defaultCount;
    }

    function setValidCount(uint _validCount) public onlyOwner {
      validCount = _validCount;
    }

    function setSinglePrice(uint _singlePrice) public onlyOwner {
      singlePrice = _singlePrice;
    }



}
