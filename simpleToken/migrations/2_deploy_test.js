var Migrations = artifacts.require("./Migrations.sol");
var SmartDistribution = artifacts.require("./SmartDistribution.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(SmartDistribution);
};
