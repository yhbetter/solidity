pragma solidity ^0.4.18;

contract owned {
    function owned() public {
        owner = msg.sender;
    }
    modifier onlyowner() {
        if (msg.sender == owner)
            _;
    }
    function isMaster() public constant returns(bool){
        return msg.sender == owner;
    }
    address owner;
}


