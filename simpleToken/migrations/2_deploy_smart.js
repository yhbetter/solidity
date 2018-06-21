var Migrations = artifacts.require("./Migrations.sol");
var HumanStandardToken = artifacts.require("./HumanStandardToken.sol");
var SmartPoolDistribution = artifacts.require("./SmartPoolDistribution.sol");
var IterableMapping = artifacts.require("./utils/IterableMapping.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(HumanStandardToken);
  deployer.deploy(IterableMapping);
  deployer.link(IterableMapping,SmartPoolDistribution);
  deployer.deploy(SmartPoolDistribution);
};
