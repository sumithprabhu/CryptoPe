const { ethers } = require("hardhat");

async function main() {
  /*
A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
so nftContract here is a factory for instances of our NFTee contract.
*/
  const Contract = await ethers.getContractFactory("Transactions");

  // here we deploy the contract
  const deployedContract = await Contract.deploy();

  // wait for the contract to deploy
  await deployedContract.deployed();

  // print the address of the deployed contract
  console.log(" Contract Address:", deployedContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });