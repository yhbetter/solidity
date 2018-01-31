pragma solidity  ^0.4.11;

contract HelloWord {
  address creator;
  string greeting;

  function HelloWord(string _greeting) public {
      creator = msg.sender;
      greeting = _greeting;
  }

  function greet() public constant returns (string) {
      return greeting;
  }

  function setGreeting(string _newGreeting) public {
      greeting = _newGreeting;
  }




}
