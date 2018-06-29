const WellDistribution = artifacts.require("WellDistribution");
const TokenFansToken = artifacts.require("TokenFansToken");
const Math = artifacts.require("Math");

contract('WellDistributionTest', function(addresses) {


  let contract;
  let token;
  let creator;
  let add1;
  let add2;
  let add3;
  let add4;



  before(async () => {
    creator = addresses[0];
    add1 = addresses[1];
    add2 = addresses[2];
    add3 = addresses[3];
    add4 = addresses[4];

    const math = await Math.new();
    TokenFansToken.link('Math', math.address);
    token = await TokenFansToken.new();
    await token.issue([creator, add1, add2, add3, add4], 1);


    contract = await WellDistribution.new(web3.toWei(1, "ether"),
      web3.toWei(1, "ether"),
      web3.toWei(1 ,"ether"), 1530028800, 1530090000, token.address, {
        from: creator
      })
  });

  it("distribution token ", async () => {
    let ba1 = await token.balanceOf.call(add1);
    console.log(ba1);
    assert.equal(ba1.toNumber(), 1, 'bal success')
  });



  it("transfer token ", async () => {
    var bal = await web3.eth.getBalance(add1);

    var bb1 = await contract.balances.call(add1);
    console.log(bb1.toNumber());
    var result = await web3.eth.sendTransaction({
      from: add1,
      to: contract.address,
      value: web3.toWei("1", "ether")
    });
    console.log(result);
    bal = await web3.eth.getBalance(add1);
    console.log(bal.toNumber());
    bb1 = await contract.balances.call(add1);
    console.log(bb1.toNumber());
  });

  //   it("distribution token ", async () => {
  //     let total = 100;
  //
  //     console.log(contract.address);
  //     let result = await token.approve(contract.address, total, {
  //       from: creator
  //     });
  //     assert(result, "approve fail ");
  //
  //     let ads = [add1, add2, add3, add4];
  //     let bls = [1, 2, 3, 4];
  //     result = await contract.distribution(ads, bls, token.address, {
  //       from: creator
  //     });
  //
  //     assert(assert, "distribution fail ");
  //
  //     let ba1 = await token.balanceOf.call(add1);
  //     let ba2 = await token.balanceOf.call(add2);
  //     let ba3 = await token.balanceOf.call(add3);
  //     let ba4 = await token.balanceOf.call(add4);
  //     assert.equal(ba1.toNumber(), 10, "ba1 not equals");
  //     assert.equal(ba2.toNumber(), 20, "ba2 not equals");
  //     assert.equal(ba3.toNumber(), 30, "ba3 not equals");
  //     assert.equal(ba4.toNumber(), 40, "ba4 not equals");
  //
  //
  //
  //   });
  //
  //
  // it("distribution token ", async () => {
  //   let creator = addresses[0];
  //   let addressLimit = 20; //地址数量限制
  //   let amountLimit = 1000; //总金额限制
  //   let amountMinLimit = 10; //单人最小金额限制
  //   let amountMaxLimit = 100; //单人最大金额限制
  //   let name = "ttt";
  //
  //   let add1 = addresses[1];
  //
  //   let contract = await SmartPoolDistribution.new(addressLimit, amountLimit, amountMinLimit, amountMaxLimit, name, {
  //     from: creator
  //   });
  //
  //
  //   let result = await web3.eth.sendTransaction({
  //     from:add1,
  //     to:contract.address,
  //     value:20,gas:1000000
  //   })
  //   console.log(result);
  // });



});
