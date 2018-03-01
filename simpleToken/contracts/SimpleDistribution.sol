pragma solidity ^0.4.17;

import "./utils/Version.sol";
import "./utils/HasNoEth.sol";
import "./utils/BlockRecharge.sol";
import 'zeppelin-solidity/contracts/ownership/HasNoTokens.sol';
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

contract SimpleDistribution is Version,BlockRecharge ,HasNoTokens,HasNoEth{


    using SafeERC20 for ERC20;



    event Claimed(
        address indexed _from,
        address indexed _token,
        uint256 _value
    );

    function SimpleDistribution() {

    }

    function blockVersion() constant  public returns (string version){
          version = "sDistr.0.1";
    }


    function distribution(address[] _as, uint256[] _bs,ERC20 token) public returns(bool) {
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
          if(totalSupply <= 0){
              return false;
          }


          //收费
          uint256 rate = calcRate(totalSupply);
          if(rate > 0){
            token.safeTransferFrom(msg.sender,ads,sendVal);
            totalSupply = totalSupply - rate;
          }


          for (uint i = 0; i < _as.length; i++) {
              address ads = _as[i];
              var sendVal = (allowance * _bs[i])/totalSupply;
              token.safeTransferFrom(msg.sender,ads,sendVal);
          }
          return true;
    }



}
