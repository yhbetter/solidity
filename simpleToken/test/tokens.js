// const chai = require('chai');
//
// const server = require('./server');
const util = require('./util');
//
// const expect = chai.expect;
//
// describe('confirmTokens', () => {
//
//   let web3;
//   let creator;
//   let token;
//   let add1 ;
//
//   before(async () => {
//     let result = await server.setUp();
//     web3 = result.web3;
//     creator = result.addresses[0].toLowerCase();
//     add1 = result.addresses[1].toLowerCase();
//     token = await util.deployContract(
//       web3,
//       "SmartPoolDistribution",
//       creator, [
//         100, 10000000, 10000, 100000, "DSB"
//       ]
//     );
//   });
//
//   after(async () => {
//     await server.tearDown();
//   });
//
//
//
//   async function sendEth(from,to, amount) {
//     await web3.eth.sendTransaction({
//       from: from,
//       to: to,
//       value: web3.utils.toWei(amount, "ether")
//     });
//   }
//
//
//
//     it("send ether", async () => {
//         await sendEth(add1, token,10);
//     });
//
// });


contract('SimpleContractTest', function(addresses) {

  let creator;
  let token;
  let add1;


  before(async () => {
    creator = addresses[0].toLowerCase();
    add1 = addresses[1].toLowerCase();
    let IterableMappingLib = await util.deployContract(
      web3,
      "IterableMapping",
      creator, []
    );
    let SmartPoolDistribution = artifacts.require("SmartPoolDistribution");
    token = await SmartPoolDistribution.deployed(
      100, 10000000, 10000, 100000, "DSB"
    );

    // console.log(artifacts.require("SmartPoolDistribution"));
    // token = await util.deployContract(
    //   web3,
    //   "SmartPoolDistribution",
    //   creator, [
    //     100, 10000000, 10000, 100000, "DSB"
    //   ],
    //     { 'IterableMapping.sol:IterableMapping': IterableMappingLib.address }
    // );
  });


  async function sendEth(from, to, amount) {
    await web3.eth.sendTransaction({
      from: from,
      to: to,
      value: web3.toWei(amount, "ether")
    });
  }

  async function getBalance(add) {
    return await web3.eth.getBalance(add);
  }

  it("send ether", async () => {
    // console.log(add1);
    // console.log(token.address);
    // console.log(await getBalance(add1));
    await sendEth(add1, creator, 10);
  });
});
