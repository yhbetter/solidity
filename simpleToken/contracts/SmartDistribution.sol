pragma solidity ^0.4.17;

import "Token.sol";

contract SmartDistribution {

    //地址期权余额
    mapping (address => uint256) public balance;
    //所有地址集合
    address[] public addressList;
    //期权总数
    uint256 public totalSupply;
    //支付的所有token
    Token[] public supportTokens;
    //token余额和总数
    mapping(address => TokenBalance) public tokenBalance;


    //地址期权余额
    mapping (address => mapping(address=>uint256)) public alreadSendBalance;

    struct TokenBalance {
      uint256 total;
      uint256 balance;
    }

  function SmartDistribution(address[] _as,uint256[] _bs) public{
        require(_as.length > 0);
        require(_as.length == _bs.length);
        for (uint i = 0; i <  _as.length; i++) {
            balance[_as[i]]= _bs[i];
            totalSupply+=_bs[i];
        }
        addressList = _as;
    }

    function support(Token t) public{
     TokenBalance balance = tokenBalance[t];
      uint256 nowBalance = t.balanceOf(this);
      balance.total = balance.total+nowBalance-balance.balance;
    }

    function claim(Token token) public{
      this.claimTo(token, msg.sender);
    }

    function claimTo(Token token,address ads) public{
          require(balance[ads]>0);
          TokenBalance bal = tokenBalance[token];
          uint256 alreadSend = alreadSendBalance[token][ads];
          uint256 val = (balance[ads]/totalSupply)*(bal.total)-alreadSend;
          require(val > 0);
          token.transfer(ads,val);
          alreadSendBalance[token][ads] = alreadSend + val;
    }


    function () payable {
      for(uint i = 0;i< supportTokens.length;i++){
        this.claim(supportTokens[i]);
      }
    }

    function claimAll() {
      for(uint i = 0;i< addressList.length;i++){
        for(uint j = 0;j< supportTokens.length;i++){
          this.claimTo(supportTokens[j],addressList[i]);
        }
      }

    }

}
