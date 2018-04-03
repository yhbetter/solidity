var HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    "development": {
      network_id: "default",

          host: "localhost",
          port: 8545
    }
  },
solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
