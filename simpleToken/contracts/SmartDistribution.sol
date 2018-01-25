pragma solidity ^0.4.17;

contract Token {
    function transfer(address _to, uint _value) public returns (bool success);
    function balanceOf(address _owner) constant public returns (uint balance);
}

contract SmartDistribution {

    mapping (address => uint256) public balance;
    uint256 public totalSupply;
    Token[] public supportTokens;
    mapping(address => mapping (address => uint256)) public alreadyBalances;
    mapping(address => uint256) public tokenBalance;

    mapping(address=>uint256) public sumTotalBalance;

    function SmartDistribution(address[] _as,uint256[] _bs) {
        require(_as.length > 0);
        require(_as.length == _bs.length);
        for (uint i = 0; i <  _as.length; i++) {
            balance[_as[i]]= _bs[i];
            totalSupply+=_bs[i];
        }
    }

    function support(Token[] tokens) {
        for(uint i = 0 ; i < tokens.length ; i++){
            supportTokens.push(tokens[i]);
        }

    }

    function claim(Token token)  {
        require(balance[msg.sender]>0);
        uint256 bal =token.balanceOf(this);
        if(bal > tokenBalance[token]){
            uint256 sub= bal - tokenBalance[token];
            tokenBalance[token] = bal;
            sumTotalBalance[token] += sub;
        }

        uint val = ((balance[msg.sender]/totalSupply)*sumTotalBalance[token])-tokenBalance[token];
        token.transfer(msg.sender,val);
    }


}
