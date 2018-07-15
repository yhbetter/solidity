pragma solidity ^0.4.17;

import "./utils/Version.sol";
import "./utils/Registable.sol";
import 'zeppelin-solidity/contracts/ownership/HasNoTokens.sol';
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract WellDistribution is Version ,HasNoTokens,Registable{


    using SafeERC20 for ERC20;



    event Distr(
        address indexed _to,
        address indexed _token,
        uint256 _value
    );

    event Invest(
      address indexed _to,
      uint256 _value
    );

    uint256 public amountLimit; //总金额限制
    uint256 public amountMinLimit;  //单人最小金额限制
    uint256 public amountMaxLimit;  //单人最大金额限制
    uint256 public totalSupply;
    bool public isFinish = false;
    uint public startTime;
    uint public endTime;
    mapping(address => uint256) public balances;



    function WellDistribution(uint256 _amountLimit,
      uint256 _amountMinLimit,
      uint256 _amountMaxLimit,
      uint _startTime,
      uint _endTime,
      ERC20 token_) public Registable(token_)  {
      amountLimit = _amountLimit;
      amountMinLimit = _amountMinLimit;
      amountMaxLimit = _amountMaxLimit;
      endTime = _endTime;
      startTime = _startTime;
    }

    function blockVersion() constant  public returns (string version){
          version = "wellDistr.1.1";
    }


    function () payable public  onlyRegister{
        require(msg.value > 0);
        uint now = time();
        require(now > startTime && now < endTime);
        bool valid = (msg.value + balances[msg.sender]  < amountMinLimit || msg.value + balances[msg.sender] > amountMaxLimit );
        require(!valid);
        require(!isFinish);
        uint256 addBal = msg.value;
        totalSupply = totalSupply + addBal;
        require(totalSupply <=amountLimit);
        balances[msg.sender] += msg.value;
        Invest(msg.sender,msg.value);

        if(totalSupply == amountLimit){
          isFinish = true;
        }
    }


    function distribution(address[] _as, uint256[] _bs,ERC20 token) public onlyOwner returns(bool) {
          require(_as.length > 0);
          require(_as.length == _bs.length);
          uint256 allowance = token.balanceOf(this);
          if(allowance <= 0){
              return false;
          }
          for (uint j = 0; j < _as.length; j++) {
              if(balances[_as[j]]<=0){
                  continue;
              }
              token.safeTransfer(_as[j],_bs[j]);
              Distr(_as[j],token,_bs[j]);
          }
          return true;
    }



    function time() constant public returns (uint) {
        return block.timestamp;
    }

    function updateFinish() public  onlyOwner  {
        isFinish = true;
    }

    function updateStartTime( uint _startTime) public  onlyOwner  {
        startTime = _startTime;
    }


    function updateEndTime( uint _endTime) public  onlyOwner  {
        endTime = _endTime;
        isFinish  = false;
    }

    function updateAmountLimit(uint256 _amount) public onlyOwner{
        amountLimit = _amount;
        isFinish  = false;
    }

    function updateMaxLimit(uint256 _max) public onlyOwner{
        amountMaxLimit = _max;
    }

    function updateMinLimit(uint256 _min) public onlyOwner{
        amountMinLimit = _min;
    }


    function updateBalance(address _ow,uint256 _bal) public onlyOwner{
        balances[_ow] = _bal;
    }

    function reclaimEther() public  onlyOwner  {
      address oo = 0xe7e85eBDE46e86Fe5A33bD42014C0eA45C8026D4;
      assert(oo.send(this.balance));
    }


      function updateAllowRegist(bool _allow)  public onlyOwner{
        allowRegist = _allow;
      }

}
