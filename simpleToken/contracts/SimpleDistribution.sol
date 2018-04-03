pragma solidity ^0.4.17;

import "./utils/Version.sol";
import "./utils/HasNoEth.sol";
import "./utils/BlockRecharge.sol";
import 'zeppelin-solidity/contracts/ownership/HasNoTokens.sol';
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

contract SimpleDistribution is Version,BlockRecharge ,HasNoTokens,HasNoEth{


    using SafeERC20 for ERC20;



    event Distr(
        address indexed _to,
        address indexed _token,
        uint256 _value
    );


    event Fee(
        address indexed _from,
        address indexed _token,
        uint256 _value
    );

    function SimpleDistribution() public {

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
            token.safeTransferFrom(msg.sender,ads,rate);
            totalSupply = totalSupply - rate;
            Fee(msg.sender,token,rate);
          }


          for (uint j = 0; j < _as.length; j++) {
              address ads = _as[j];
              uint256 sendVal = (allowance * _bs[j])/totalSupply;
              token.safeTransferFrom(msg.sender,ads,sendVal);
              Distr(ads,token,sendVal);
          }
          return true;
    }



}
