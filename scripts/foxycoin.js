// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hardhat = require("hardhat");

async function main() {
  const foxyCoin = await hardhat.ethers.getContractFactory("FoxyCoin");
  console.log(`Deploying contract with the account: ${foxyCoin.runner.address}`);

  const deplyedFoxyCoin = await foxyCoin.deploy(foxyCoin.runner.address);
  await deplyedFoxyCoin.waitForDeployment();

  let deplyedFoxyCoinAddress = await deplyedFoxyCoin.getAddress();
  console.log(`Contract deployed to ${deplyedFoxyCoinAddress} on ${hardhat.network.name}`);

  const WAIT_BLOCK_CONFIRMATIONS = 6;
  await deplyedFoxyCoin.deploymentTransaction().wait(WAIT_BLOCK_CONFIRMATIONS);

  console.log(`Verifying contract on ${hardhat.network.name}...`);
  await hardhat.run(`verify:verify`, {
    address: deplyedFoxyCoinAddress,
    constructorArguments: [
        foxyCoin.runner.address
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
