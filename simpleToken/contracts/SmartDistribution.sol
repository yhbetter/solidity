pragma solidity ^0.4.17;

import "./Token.sol";
import "./utils/Version.sol";
import "./utils/HasNoEth.sol";
import 'zeppelin-solidity/contracts/ownership/HasNoTokens.sol';

contract SmartDistribution is Version ,HasNoTokens,HasNoEth{

    //地址期权余额
    mapping(address => uint256) public balance;
    //所有地址集合
    address[] public addressList;
    uint256 public addressCount;

    //期权总数
    uint256 public totalSupply;
    //支付的所有token
    Token[] public supportTokens;
    //token余额和总数
    mapping(address => TokenBalance) public tokenBalance;



    //地址期权余额
    mapping(address => mapping(address => uint256)) public alreadSendBalance;
    mapping(address => mapping(address => uint256)) public distrBalance;

    event Claimed(
            address indexed _from,
            address indexed _token,
            uint256 _value
        );


    struct TokenBalance {
        uint256 total;
        uint256 balance;
    }

    function SmartDistribution(address[] _as, uint256[] _bs) public {
        require(_as.length > 0);
        require(_as.length == _bs.length);
        for (uint i = 0; i < _as.length; i++) {
            balance[_as[i]] += _bs[i];
            totalSupply += _bs[i];
        }
        addressList = _as;
        addressCount = _as.length;
    }


    function blockVersion() constant public returns (string version){
        version="distr.0.1";
    }


    function support(Token t) public onlyOwner returns (bool) {
        TokenBalance storage bal = tokenBalance[t];
        uint256 nowBalance = t.balanceOf(this);
        if(nowBalance == bal.balance){
            return false;
        }
        uint256 received = nowBalance - bal.balance;
        bal.total = bal.total + nowBalance - bal.balance;
        bal.balance = nowBalance;
        bool exists = false;
        for (uint j = 0; j < supportTokens.length; j++) {
            if(t == supportTokens[j]){
              exists = true;
            }
        }
        if(!exists){
            supportTokens.push(t);
        }

        for (uint i = 0; i < addressList.length; i++) {
            address ads = addressList[i];
            distrBalance[t][ads] = alreadSendBalance[t][ads]+((received*balance[ads])/totalSupply);
        }
        return true;
    }

    function claim(Token token) public {
        claimTo(token, msg.sender);
    }

    function claimTo(Token token, address ads) public {
        require(balance[ads] > 0);
        uint256 distr = distrBalance[token][ads];
        uint256 alredSend = alreadSendBalance[token][ads];
        uint256 val = distr-alredSend;
        require(val > 0);
        bool success = token.transfer(ads,val);
        if(success){
           alreadSendBalance[token][ads]=distr;

           TokenBalance storage bal = tokenBalance[token];
           bal.balance-=val;
           Claimed(ads,token,val);
        }

    }


    function() payable public {
      claimImpl();
    }

    function claimImpl() public{
      for (uint i = 0; i < supportTokens.length; i++) {
          claim(supportTokens[i]);
      }
    }

    function claimAll(Token token) payable public {
        for (uint i = 0; i < addressList.length; i++) {
            claimTo(token, addressList[i]);
        }

    }

}
