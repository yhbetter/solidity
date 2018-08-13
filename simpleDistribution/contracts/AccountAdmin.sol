pragma solidity ^0.4.17;

import "./utils/Version.sol";
import "./AgentAccount.sol";
import "./AccountPool.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';


contract AccountAdmin  is Version,Ownable {

    mapping (address => AgentAccount[]) public accountMap;

    AccountPool public accountPool;

    event Account(
        address indexed _owner,
        address indexed _token,
        uint256 _index
    );

    function blockVersion() constant  public returns (string version){
      version = "AccountAdmin.1.0";
    }


    constructor(AccountPool _pool) public  {
      accountPool = _pool;
    }

    function setPool(AccountPool _pool) public onlyOwner {
      accountPool = _pool;
    }


    function createAccount(uint count) public {
      createAccountForOther(count,msg.sender);
    }


    function createAccountForOther(uint count,address ads) public {
      uint start = accountMap[ads].length;
      uint end = start + count;
      require(accountPool.getHoldCount(ads) >=end);
      while(start < end){
        accountMap[ads].push(new AgentAccount(ads));
        emit Account(ads,accountMap[ads][start],start);
        start++;
      }
    }



    function batchSendEth(uint start,uint end,address adr,uint value,uint gas) public payable{
      AgentAccount[] storage asList  = accountMap[msg.sender];
      while(start < end){
        AgentAccount  account = asList[start];
        require(account.transferEth.value(value)(adr,value,gas));
        start++;
      }
    }

    function batchSendToken(uint start,uint end,ERC20 token,address adr,uint value) public {
      AgentAccount[] storage asList  = accountMap[msg.sender];
      while(start < end){
        AgentAccount  account = asList[start];
        require(account.transferToken(token,adr,value));
        start++;
      }
    }

    function batchCalimEth(uint start,uint end) public  {
      AgentAccount[] storage asList  = accountMap[msg.sender];
      while(start < end){
        AgentAccount  account = asList[start];
        uint val = address(account).balance;
        if(val > 0){
          require(account.transferEth(msg.sender,val,21000));
        }
        start++;
      }
    }

    function batchCalimToken(uint start,uint end,ERC20 token) public {
      AgentAccount[] storage asList  = accountMap[msg.sender];
      while(start < end){
        AgentAccount  account = asList[start];
        uint val = token.balanceOf(account);
        if(val > 0){
          require(account.transferToken(token,msg.sender,val));
        }
        start++;
      }
    }

    function accountCount() constant  public returns(uint){
        return accountMap[msg.sender].length;
    }

    function accountAddress(uint index) constant  public returns(address){
        return accountMap[msg.sender][index];
    }



}
