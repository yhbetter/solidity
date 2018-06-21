const SmartPoolDistribution = artifacts.require("SmartPoolDistribution");
const HumanStandardToken = artifacts.require("HumanStandardToken");

contract('SmartPoolDistributionTest', function(addresses) {



  it("distribution token ", async () => {
    let creator = addresses[0];
    let addressLimit = 20; //地址数量限制
    let amountLimit = 1000; //总金额限制
    let amountMinLimit = 10; //单人最小金额限制
    let amountMaxLimit = 100; //单人最大金额限制
    let name = "ttt";

    let add1 = addresses[1];

    let contract = await SmartPoolDistribution.new(addressLimit, amountLimit, amountMinLimit, amountMaxLimit, name, {
      from: creator
    });


    let result = await web3.eth.sendTransaction({
      from:add1,
      to:contract.address,
      value:20,gas:1000000
    })
    console.log(result);




  });



});
