pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/HumanStandardToken.sol";
import "../contracts/SimpleDistribution.sol";

contract TestDistr {

      SimpleDistribution simple;
      HumanStandardToken token;
      address ad1;
      address ad2;
      address ad3;
  address[] aas;
    uint256[] bs;
          function beforeAll() public {

              simple = new SimpleDistribution();
              token = new HumanStandardToken(1000000, "AS ANGEL", 0, "ASA");
              this = TestDistr(0x3c33Eb8A1783d84f46c3510d056120187d55F1bf);
              ad1 = address(0x3c33Eb8A1783d84f46c3510d056120187d55F1bf);
              ad2 = address(0x3c33Eb8A1783d84f46c3510d056120187d55F1bf);

               aas = new address[](1);

               aas[0] = ad1;

             bs = new uint256[](1);
             bs[0] = 200;
          }

          function testSmart() public {
              uint va = 200;
              var result = token.approve(simple,va);
              Assert.isTrue(result, "approve fail ");
              result = simple.distribution(aas,bs,ERC20(token));
              Assert.isTrue(result, "distribution fail ");
              var bal = token.balanceOf(ad1);

              Assert.equal(bal, 201, "address 1 balance error ");

          }

}
