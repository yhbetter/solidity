pragma solidity ^0.4.17;

contract Token {
    /* This is a slight change to the ERC20 base standard.
    function totalSupply() constant returns (uint256 supply);
    is replaced with:
    uint256 public totalSupply;
    This automatically creates a getter function for the totalSupply.
    This is moved to the base contract since public getter functions are not
    currently recognised as an implementation of the matching abstract
    function by the compiler.
    */
    /// total amount of tokens
    uint256 public totalSupply;

    /// @param _owner The address from which the balance will be retrieved
    /// @return The balance
    function balanceOf(address _owner) constant returns (uint256 balance);

    /// @notice send `_value` token to `_to` from `msg.sender`
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return Whether the transfer was successful or not
    function transfer(address _to, uint256 _value) returns (bool success);

    /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return Whether the transfer was successful or not
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);


    event Transfer(address indexed _from, address indexed _to, uint256 _value);
}

contract Distribution {

mapping (address => uint256) public balance;
uint256 totalSupply;
Token supportTokens;
mapping (Token => mapping (address => uint256)) public alreadyBalances;
mapping(Token=>uint256) public tokenBalance;

mapping(Token=>uint256) public sumTotalBalance;

  function Distribution(address[] as,uint256[] bs) {
    require(as.length > 0);
    require(as.length == bs.length);
    for (uint i = 0; i <  as.length; i++) {
        balance[as[i]]= bs[i];
        totalSupply+=bs[i];
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
