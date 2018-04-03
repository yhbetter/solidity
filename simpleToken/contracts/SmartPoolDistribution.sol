pragma solidity ^0.4.17;

import "./Token.sol";
import "./utils/Version.sol";
import "./owned.sol";


contract SmartPoolDistribution is Version ,owned,Token{

        string public name;                   //fancy name: eg Simon Bucks
        uint8 public decimals = 8;                //How many decimals to show. ie. There could 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 ether.
        string public symbol;                 //An identifier: eg SBX
        string public version = 'BLOCKAPP';       //human 0.1 standard. Just an arbitrary versioning scheme.



        mapping (address => uint256) balances;
        mapping (address => mapping (address => uint256)) allowed;

        address[] public addressList;

        uint256 public addressLimit; //地址数量限制
        uint256 public amountLimit; //总金额限制
        uint256 public amountMinLimit;  //单人最小金额限制
        uint256 public amountMaxLimit;  //单人最大金额限制

        function SmartPoolDistribution(
                uint256 _addressLimit,
                uint256 _amountLimit,
                uint256 _amountMinLimit,
                uint256 _amountMaxLimit,
                string _tokenName) public{
          name = _tokenName;
          symbol = _tokenName;
          addressLimit = _addressLimit;
          amountLimit = _amountLimit;
          amountMinLimit = _amountMinLimit;
          amountMaxLimit = _amountMaxLimit;
        }

      function transfer(address _to, uint256 _value) public returns (bool success) {
          if (balances[msg.sender] >= _value && _value > 0) {
              balances[msg.sender] -= _value;
              balances[_to] += _value;
              Transfer(msg.sender, _to, _value);
              return true;
          } else { return false; }
      }

      function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
          if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0) {
              balances[_to] += _value;
              balances[_from] -= _value;
              allowed[_from][msg.sender] -= _value;
              Transfer(_from, _to, _value);
              return true;
          } else { return false; }
      }

      function balanceOf(address _owner) constant public returns (uint256 balance) {
          return balances[_owner];
      }

      function approve(address _spender, uint256 _value)  public returns (bool success) {
          allowed[msg.sender][_spender] = _value;
          Approval(msg.sender, _spender, _value);
          return true;
      }

      function allowance(address _owner, address _spender) constant public returns (uint256 remaining) {
        return allowed[_owner][_spender];
      }


      function blockVersion() constant  public returns (string _version){
          _version = "";
      }

      function transferAdd(address _to,uint256 _value) internal returns ( bool success){
          if(balances[_to] == 0 ){
            addressList.push(_to);
          }
          balances[_to] +=_value;
          success = true;
      }


      function() payable public {
         if(msg.value > 0){
           transferAdd(msg.sender,msg.value);
           totalSupply +=msg.value;
         }
      }

      function claimEth(address _to) public onlyowner returns (bool success) {
          _to.transfer(balanceOf(this));
          success  = true;
      }

}
