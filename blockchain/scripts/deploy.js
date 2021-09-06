const { ethers } = require("hardhat");
const fs = require("fs");
const path = 'src/environment/contract-address.json';

async function main() {
  const BankContract = await ethers.getContractFactory("Bank");
  const bank = await BankContract.deploy();
  await bank.deployed();
  console.log("Bank Contract was deployed to: " + bank.address);

  const TokenContract = await ethers.getContractFactory("Token");
  const token = await TokenContract.deploy(bank.address);
  await token.deployed();
  console.log("Token Contract was deployed to: " + token.address);

  // Create the environment file with the smart contract addresses
  let addresses = {
    "bankcontract": bank.address,
    "tokencontract": token.address
  };

  let addressJSON = JSON.stringify(addresses);

  fs.writeFileSync(path, addressJSON);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch ((error) => {
    console.error(error);
    process.exit(1);
  });