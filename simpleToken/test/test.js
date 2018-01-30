pragma solidity ^0.4.17;

import "truffle/Assert.sol";   // 引入的断言
import "truffle/DeployedAddresses.sol";  // 用来获取被测试合约的地址
import "../contracts/SmartDistribution.sol";      // 被测试合约

contract TestAdoption {
  SmartDistribution smart = SmartDistribution(DeployedAddresses.SmartDistribution());

  function testUserCanAdoptPet() public {
  }

}
