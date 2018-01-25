pragma solidity ^0.4.17;

import "Token.sol";

contract SmartDistribution {

    mapping (address => uint256) public balance;
    address[] addressList;
    uint256 public totalSupply;
    Token[] public supportTokens;
    mapping(address => uint256) public tokenBalance;

  function SmartDistribution(address[] _as,uint256[] _bs) {
        require(_as.length > 0);
        require(_as.length == _bs.length);
        for (uint i = 0; i <  _as.length; i++) {
            balance[_as[i]]= _bs[i];
            totalSupply+=_bs[i];
        }
        addressList = _as;
    }

    function support(Token[] tokens) {
        for(uint i = 0 ; i < tokens.length ; i++){
            Token t = tokens[i];
            uint val =tokenBalance[t];
            if(val>0){
              continue;
            }
            supportTokens.push(t);
            tokenBalance[t] =  t.balanceOf(this);
        }
    }

    function claim(Token token){
      this.claimTo(token, msg.sender);
    }

    function claimTo(Token token,address ads) {

          require(balance[ads]>0);
          uint val = (balance[ads]/totalSupply)*tokenBalance[token];
          token.transfer(ads,val);
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
