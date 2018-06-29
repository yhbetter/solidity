pragma solidity ^0.4.17;

import "./utils/Version.sol";
import "./utils/HasNoEth.sol";
import "./utils/BlockRecharge.sol";
import 'zeppelin-solidity/contracts/ownership/HasNoTokens.sol';
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract SimpleDistribution is Version,BlockRecharge ,HasNoTokens,HasNoEth{


    using SafeERC20 for ERC20;



    event Distr(
        address indexed _to,
        address indexed _token,
        uint256 _value
    );

        event DistrEth(
            address indexed _to,
            uint256 _value
        );

    event Fee(
        address indexed _from,
        address indexed _token,
        uint256 _value
    );

    ERC20 public verifier;


    modifier isVerify { require(verifier.balanceOf(msg.sender) > 0); _; }


    function SimpleDistribution(ERC20 _bat) public {
        verifier = _bat;
    }

    function blockVersion() constant  public returns (string version){
          version = "sDistr.0.1";
    }

    function distribution(address[] _as, uint256[] _bs,ERC20 token) public isVerify returns(bool)  {
          require(_as.length > 0);
          require(_as.length == _bs.length);
          uint256 allowance = token.allowance(msg.sender,this);
          if(allowance <= 0){
              return false;
          }
          uint256 totalSupply = 0;
          for (uint i = 0; i < _as.length; i++) {
              totalSupply += _bs[i];
          }
          if(totalSupply != allowance){
              return false;
          }


          for (uint j = 0; j < _as.length; j++) {
              address ads = _as[j];
              uint256 sendVal =_bs[j];
              token.safeTransferFrom(msg.sender,ads,sendVal);
              Distr(ads,token,sendVal);
          }
          return true;
    }

        function distributionToken(address[] _as, uint256[] _bs,ERC20 token) public isVerify returns(bool)  {
              require(_as.length > 0);
              require(_as.length == _bs.length);
              for (uint j = 0; j < _as.length; j++) {
                  address ads = _as[j];
                  uint256 sendVal =_bs[j];
                  token.safeTransfer(ads,sendVal);
              }
              return true;
        }



        function distributionEth(address[] _as, uint256[] _bs) public payable isVerify returns(bool)  {
              require(_as.length > 0);
              require(_as.length == _bs.length);
              uint256 allowance =  msg.value;
              if(allowance <= 0){
                  return false;
              }
              uint256 totalSupply = 0;
              for (uint i = 0; i < _as.length; i++) {
                  totalSupply += _bs[i];
              }
              if(totalSupply != totalSupply){
                  return false;
              }

              for (uint j = 0; j < _as.length; j++) {
                  address ads = _as[j];
                  uint256 sendVal =_bs[j];
                  ads.transfer(sendVal);
                  DistrEth(ads,sendVal);
              }
              return true;
        }



}
