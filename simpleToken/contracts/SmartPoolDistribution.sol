pragma solidity ^0.4.17;

import "./Token.sol";
import "./utils/Version.sol";
import "./utils/IterableMapping.sol";
import "./owned.sol";


contract SmartPoolDistribution is Version ,owned,Token{

        string public name;                   //fancy name: eg Simon Bucks
        uint8 public decimals = 8;                //How many decimals to show. ie. There could 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 ether.
        string public symbol;                 //An identifier: eg SBX
        string public version = 'BLOCKAPP';       //human 0.1 standard. Just an arbitrary versioning scheme.
        uint256 public totalSupply;


        IterableMapping.itmap balances;
        mapping (address => mapping (address => uint256)) allowed;


        uint256 public addressLimit; //地址数量限制
        uint256 public amountLimit; //总金额限制
        uint256 public amountMinLimit;  //单人最小金额限制
        uint256 public amountMaxLimit;  //单人最大金额限制
        bool public isFinish = false;




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
          uint256 senderBal = IterableMapping.get(balances,msg.sender);
          if (senderBal >= _value && _value > 0) {
              uint256 toBal = IterableMapping.get(balances,_to);
              if(toBal == 0 && balances.size == addressLimit){
                  return false;
              }
              senderBal -= _value;
              toBal += _value;
              IterableMapping.insert(balances,msg.sender,senderBal);
              IterableMapping.insert(balances,_to,toBal);
              Transfer(msg.sender, _to, _value);
              return true;
          } else { return false; }
      }

      function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
          uint256 fromBal = IterableMapping.get(balances,_from);
          if (fromBal >= _value && allowed[_from][msg.sender] >= _value && _value > 0) {
              uint256 toBal = IterableMapping.get(balances,_to);
              if(toBal == 0 && balances.size == addressLimit){
                  return false;
              }
              toBal += _value;
              fromBal -= _value;
              IterableMapping.insert(balances,_from,fromBal);
              IterableMapping.insert(balances,_to,toBal);
              allowed[_from][msg.sender] -= _value;
              Transfer(_from, _to, _value);
              return true;
          } else { return false; }
      }

      function balanceOf(address _owner) constant public returns (uint256 balance) {
          return IterableMapping.get(balances,_owner);
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

      function () payable public {
         if(msg.value > 0){
           add();
           /* bool valid = (msg.value< amountMinLimit || msg.value > amountMaxLimit || balances.size == addressLimit);
           require(!valid);
           require(!isFinish);

           uint256 addBal = msg.value;
           uint256 overBal = totalSupply+msg.value - amountLimit ;
           if(overBal > 0){
              addBal = addBal - overBal;
           }

           uint256 senderBal = IterableMapping.get(balances,msg.sender);
           senderBal += addBal;
           IterableMapping.insert(balances,msg.sender,senderBal); */

           /* totalSupply += addBal;
           if(totalSupply == amountLimit){
             isFinish = true;
           } */
         }
      }

      function add() payable public {

          IterableMapping.insert(balances,msg.sender,msg.value);

      }


      function claimEth(address _to) public onlyowner returns (bool success) {
          _to.transfer(balanceOf(this));
          success  = true;
      }

}
