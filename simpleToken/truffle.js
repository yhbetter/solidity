var HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
