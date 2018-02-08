pragma solidity ^0.4.17;

import "./token/Token.sol";
import "./interface/Version.sol";
import "./library/features.sol";

contract SmartDistribution is Version ,owned{

    //地址期权余额
    mapping(address => uint256) public balance;
    //所有地址集合
    address[] public addressList;
    //期权总数
    uint256 public totalSupply;
    //支付的所有token
    Token[] public supportTokens;
    //token余额和总数
    mapping(address => TokenBalance) public tokenBalance;



    //地址期权余额
    mapping(address => mapping(address => uint256)) public alreadSendBalance;
    mapping(address => mapping(address => uint256)) public distrBalance;

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
    }


    function blockVersion() constant public returns (string version){
        version="distr.0.1";
    }


    function support(Token t) public returns (bool) {
        TokenBalance storage bal = tokenBalance[t];
        uint256 nowBalance = t.balanceOf(this);
        if(nowBalance == bal.balance){
            return false;
        }
        uint256 received = nowBalance - bal.balance;
        bal.total = bal.total + nowBalance - bal.balance;
        supportTokens.push(t);

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
        token.transfer(ads,val);

    }


    function() payable public {
        for (uint i = 0; i < supportTokens.length; i++) {
            claim(supportTokens[i]);
        }
    }

    function claimAll() public {
        for (uint i = 0; i < addressList.length; i++) {
            for (uint j = 0; j < supportTokens.length; j++) {
                claimTo(supportTokens[j], addressList[i]);
            }
        }

    }

}
