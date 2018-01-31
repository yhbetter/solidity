var HelloWord = artifacts.require("HelloWord");

module.exports = function(deployer) {
  deployer.deploy(HelloWord);
};
