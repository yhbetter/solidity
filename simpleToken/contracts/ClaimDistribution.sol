pragma solidity ^0.4.17;

import "./utils/Version.sol";
import "./utils/HasNoEth.sol";
import 'zeppelin-solidity/contracts/ownership/HasNoTokens.sol';
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract ClaimDistribution is Version ,HasNoTokens,HasNoEth{


      using SafeERC20 for ERC20;


      ERC20 public token;
      uint public step;


      mapping (address => bool) public blacklist;

      function ClaimDistribution(ERC20 _t ,uint _s) {
        token  = _t;
        step = _s;
      }

      function blockVersion() constant  public returns (string version){
            version = "ClaimDistribution.0.1";
      }

      function() payable public {
            require(blacklist[msg.sender] == false);
            token.safeTransferFrom(owner,msg.sender,step);
            blacklist[msg.sender]= true;
      }


      function setToken(ERC20 _t ) public onlyOwner{
            token = _t;
      }

      function setStep( uint _s) public onlyOwner{
            step = _s;
      }

}
