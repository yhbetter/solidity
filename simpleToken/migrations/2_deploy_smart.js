var Migrations = artifacts.require("./Migrations.sol");
var HumanStandardToken = artifacts.require("./HumanStandardToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(HumanStandardToken);
};
