const SimpleDistribution = artifacts.require("SimpleDistribution");
const HumanStandardToken = artifacts.require("HumanStandardToken");

contract('SimpleDistributionTest', function(addresses) {
  // 
  // let contract;
  // let token;
  // let creator;
  // let add1;
  // let add2;
  // let add3;
  // let add4;
  //
  //
  // before(async () => {
  //   creator = addresses[0];
  //   add1 = addresses[1];
  //   add2 = addresses[2];
  //   add3 = addresses[3];
  //   add4 = addresses[4];
  //   contract = await SimpleDistribution.new();
  //   token = await HumanStandardToken.new(
  //     1800000000000000000000000000, "SSS", 18, "sss", {
  //       from: creator
  //     }
  //   );
  //
  //   var bal = await token.balanceOf.call(creator);
  // });
  //
  // it("distribution token ", async () => {
  //   let total = 100;
  //
  //   console.log(contract.address);
  //   let result = await token.approve(contract.address, total, {
  //     from: creator
  //   });
  //   assert(result, "approve fail ");
  //
  //   let ads = [add1, add2, add3, add4];
  //   let bls = [1, 2, 3, 4];
  //   result = await contract.distribution(ads, bls, token.address, {
  //     from: creator
  //   });
  //
  //   assert(assert, "distribution fail ");
  //
  //   let ba1 = await token.balanceOf.call(add1);
  //   let ba2 = await token.balanceOf.call(add2);
  //   let ba3 = await token.balanceOf.call(add3);
  //   let ba4 = await token.balanceOf.call(add4);
  //   assert.equal(ba1.toNumber(), 10, "ba1 not equals");
  //   assert.equal(ba2.toNumber(), 20, "ba2 not equals");
  //   assert.equal(ba3.toNumber(), 30, "ba3 not equals");
  //   assert.equal(ba4.toNumber(), 40, "ba4 not equals");
  //
  //
  //
  // });
  //
  //
  //
  //
  // it("distribution eth ", async () => {
  //   let total = 10;
  //
  //
  //   console.log(contract.address);
  //
  //
  //   let bala1 = await web3.eth.getBalance(add1);
  //   let bala2 = await web3.eth.getBalance(add2);
  //   let bala3 = await web3.eth.getBalance(add3);
  //   let bala4 = await web3.eth.getBalance(add4);
  //
  //
  //   let ads = [add1, add2, add3, add4];
  //   let bls = [1, 2, 3, 4];
  //   result = await contract.distributionEth(ads, bls, {
  //     from: creator,
  //     value: web3.toWei(total,"ether")
  //   });
  //
  //   assert(result, "distributionEth fail ");
  //
  //
  //   let ba1 = await web3.eth.getBalance(add1);
  //   let ba2 = await web3.eth.getBalance(add2);
  //   let ba3 = await web3.eth.getBalance(add3);
  //   let ba4 = await web3.eth.getBalance(add4);
  //
  //   console.log(ba1);
  //   console.log(bala1);
  //   assert.equal(ba1.toNumber(), bala1.toNumber() + 11, "ba1 eth not equals");
  //   assert.equal(ba2.toNumber(), bala2.toNumber() + 20, "ba2 eth not equals");
  //   assert.equal(ba3.toNumber(), bala3.toNumber() + 30, "ba3 eth not equals");
  //   assert.equal(ba4.toNumber(), bala4.toNumber() + 40, "ba4 eth not equals");
  //
  //
  //
  // });


});
