var TodoList = artifacts.require("./Prescriptions.sol");

module.exports = function(deployer) {
  deployer.deploy(TodoList);
};