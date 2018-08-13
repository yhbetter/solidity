pragma solidity ^0.4.17;

import "./utils/Version.sol";
import "./utils/HasNoEth.sol";
import "./utils/Registable.sol";
import "zeppelin-solidity/contracts/ownership/HasNoTokens.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract SimpleDistribution is Registable,Version ,HasNoTokens,HasNoEth{


    using SafeERC20 for ERC20;
    using SafeMath for uint;

    uint public countFee;


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


    function SimpleDistribution(uint _fee ,ERC20 _bat) public  Registable(_bat)  {
        countFee = _fee;
    }

    function blockVersion() constant  public returns (string version){
          version = "sDistr.0.2";
    }

    function setFee(uint _fee) public  onlyOwner  {
      countFee = _fee;
    }

    function distribution(address[] _as, uint256[] _bs,ERC20 token) public  payable returns(bool)  {
          require(_as.length > 0);
          require(_as.length == _bs.length);

          if(!isVerify()){
              uint fee = countFee.mul(_as.length);
              if(msg.value < fee){
                  revert();
              }
          }
          for (uint j = 0; j < _as.length; j++) {
              address ads = _as[j];
              uint256 sendVal =_bs[j];
              token.safeTransferFrom(msg.sender,ads,sendVal);
              emit Distr(ads,token,sendVal);
          }
          return true;
    }

    function distributionEth(address[] _as, uint256[] _bs) public payable  returns(bool)  {
          require(_as.length > 0);
          require(_as.length == _bs.length);

          if(!isVerify()){
              uint fee = countFee.mul(_as.length);
              if(msg.value < fee){
                  revert();
              }
          }
          for (uint j = 0; j < _as.length; j++) {
              address ads = _as[j];
              uint256 sendVal =_bs[j];
              ads.transfer(sendVal);
              emit DistrEth(ads,sendVal);
          }
          return true;
    }




}
