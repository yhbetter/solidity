pragma solidity ^0.4.17;

import "./utils/Version.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract AgentAccount is Version{

    address public owner;

   constructor(address _owner) public {
      owner = _owner;
    }

    modifier onlyOwner() {
      require(tx.origin == owner);
      _;
    }

    function () public payable {

    }

    function blockVersion() constant  public  returns (string version){
      version = "AgentAccount.1.0";
    }

    function transferEth(address adr,uint _value,uint _gas) public payable onlyOwner returns(bool) {
       return adr.call.gas(_gas).value(_value)();
    }

    function transferToken(ERC20 token ,address adr,uint _value) public onlyOwner returns(bool) {
       return token.transfer(adr,_value);
    }

    function approveToken(ERC20 token ,uint _value,address adr) public onlyOwner returns(bool) {
       return token.approve(adr,_value);
    }

}
