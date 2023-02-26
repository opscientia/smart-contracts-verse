const { ethers, run } = require("hardhat");
require("dotenv").config({path: ".env"});

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

async function main() {
  const identityContract = await ethers.getContractFactory("Identity");

  console.log("Deploying Contract....");
  const deployedIdentityContract = await identityContract.deploy();
  
  await deployedIdentityContract.deployed();

  console.log("Your Contract Address:", deployedIdentityContract.address);

  if(ETHERSCAN_API_KEY){
     console.log("Waiting for block confirmations....");
     await deployedIdentityContract.deployTransaction.wait(6);
     verify(deployedIdentityContract.address, []);
  }
}

async function verify(contractAddress, args){
  console.log("Verifying Contract....");
  try{
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  }
  catch(err){
    if(err.message.toLowerCase().includes("already verified")){
      console.log("already verified");
    }
    else{
      console.error(err);
    }
  }
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//contract address goerli --> 0xA63D54891448A38882db4F39d09Ed88aA08325e8
//contract addres --> 0x1303b8b950fbbb689171a577C023F07EF77eeD79