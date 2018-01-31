pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/HumanStandardToken.sol";
import "../contracts/SmartDistribution.sol";

contract TestToken {
    SmartDistribution smart;
    HumanStandardToken token;
    address ad1;
    address ad2;
    address ad3;

    uint256  smartBal;
    uint256 ad2Bal;
    uint256 ad1Bal;


    address[]  aList;
    uint256[]   uList;


    uint256 count;

    function beforeAll() public {

        token = new HumanStandardToken(100000000000000, "AS ANGEL", 8, "ASA");
        ad1 = address(this);
        ad2 = address(0x9EfB529008d4E10AB0E57Dea9B6a573990c25085);

        aList = new address[](2);
        aList[0] = ad1;
        aList[1] = ad2;
        uList = new uint256[](2);
        uList[0] = 10;
        uList[1] = 20;
    }

    //
    //    function testSmart() public {
    //
    //
    //        uint256 bal = token.balanceOf(ad1);
    //        Assert.equal(bal, 100000000000000, "Token balance is ");
    //
    //        smart = new SmartDistribution(aList, uList);
    //        bool result = token.transfer(smart, 3000000);
    //        Assert.isTrue(result, "transfer fail ");
    //
    //
    //        smartBal = token.balanceOf(smart);
    //        Assert.equal(smartBal, 3000000, "smart balance error ");
    //
    //
    //        smart.support(token);
    //
    //
    //        smart.claimTo(token, ad2);
    //        smartBal = token.balanceOf(smart);
    //        Assert.equal(smartBal, 1000000, "smart 2 balance error ");
    //
    //        ad2Bal = token.balanceOf(ad2);
    //        Assert.equal(ad2Bal, 2000000, "address 2 balance error ");
    //
    //
    //        smart.claim(token);
    //        smartBal = token.balanceOf(smart);
    //        Assert.equal(smartBal, 0, "smart 2 balance error ");
    //
    //        ad1Bal = token.balanceOf(ad1);
    //        Assert.equal(ad1Bal, 99999998000000, "address 1 balance error ");
    //    }


    function testAll() public {


        uint256 bal = token.balanceOf(ad1);
        Assert.equal(bal, 100000000000000, "Token balance is ");

        smart = new SmartDistribution(aList, uList);
        bool result = token.transfer(smart, 3000000);
        Assert.isTrue(result, "transfer fail ");


        smartBal = token.balanceOf(smart);
        Assert.equal(smartBal, 3000000, "smart balance error ");


        smart.support(token);


        smart.claimAll();
        smartBal = token.balanceOf(smart);
        Assert.equal(smartBal, 0, "smart 2 balance error ");

        ad2Bal = token.balanceOf(ad2);
        Assert.equal(ad2Bal, 2000000, "address 2 balance error ");


        ad1Bal = token.balanceOf(ad1);
        Assert.equal(ad1Bal, 99999998000000, "address 1 balance error ");
    }
}
