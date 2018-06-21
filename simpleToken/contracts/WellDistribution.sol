pragma solidity ^0.4.17;

import "./utils/Version.sol";
import "./utils/HasNoEth.sol";
import "./utils/BlockRecharge.sol";
import 'zeppelin-solidity/contracts/ownership/HasNoTokens.sol';
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract WellDistribution is Version,BlockRecharge ,HasNoTokens,HasNoEth{


    using SafeERC20 for ERC20;



    event Distr(
        address indexed _to,
        address indexed _token,
        uint256 _value
    );

    event invest(
      address indexed _to,
      uint256 _value
    );


    uint256 public amountLimit; //总金额限制
    uint256 public amountMinLimit;  //单人最小金额限制
    uint256 public amountMaxLimit;  //单人最大金额限制
    uint256 public totalSupply;
    bool public isFinish = false;
    mapping (address => uint256) balances;


    function WellDistribution(uint256 _amountLimit,uint256 _amountMinLimit,uint256 _amountMaxLimit) public {
      amountLimit = _amountLimit;
      amountMinLimit = _amountMinLimit;
      amountMaxLimit = _amountMaxLimit;
    }

    function blockVersion() constant  public returns (string version){
          version = "sDistr.0.1";
    }


    function () payable public {
        require(msg.value > 0);
        bool valid = (msg.value< amountMinLimit || msg.value > amountMaxLimit );
        require(!valid);
        require(!isFinish);
        uint256 addBal = msg.value;
        totalSupply = totalSupply + addBal;
        require(totalSupply <=amountLimit);
        balances[msg.sender] += msg.value;
        invest(msg.sender,msg.value);

        if(totalSupply == amountLimit){
          isFinish = true;
        }

    }


    function distribution(address[] _as, uint256[] _bs,ERC20 token) public returns(bool) {
          require(_as.length > 0);
          require(_as.length == _bs.length);
          uint256 allowance = token.balanceOf(this);
          if(allowance <= 0){
              return false;
          }
          for (uint j = 0; j < _as.length; j++) {
              address ads = _as[j];
              uint256 quantity = balances[ads];
              if(quantity<=0){
                  continue;
              }
              uint256 sendVal =SafeMath.mul(quantity,_bs[j]);
              token.safeTransfer(ads,sendVal);
              Distr(ads,token,sendVal);
          }
          return true;
    }



}
