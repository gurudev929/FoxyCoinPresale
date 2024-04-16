// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hardhat = require("hardhat");

async function main() {
  const foxyUsdt = await hardhat.ethers.getContractFactory("FUSDT");
  console.log(`Deploying contract with the account: ${foxyUsdt.runner.address}`);

  const deplyedfoxyUsdt = await foxyUsdt.deploy(foxyUsdt.runner.address);
  await deplyedfoxyUsdt.waitForDeployment();

  let deplyedfoxyUsdtAddress = await deplyedfoxyUsdt.getAddress();
  console.log(`Contract deployed to ${deplyedfoxyUsdtAddress} on ${hardhat.network.name}`);

  const WAIT_BLOCK_CONFIRMATIONS = 6;
  await deplyedfoxyUsdt.deploymentTransaction().wait(WAIT_BLOCK_CONFIRMATIONS);

  console.log(`Verifying contract on ${hardhat.network.name}...`);
  await hardhat.run(`verify:verify`, {
    address: deplyedfoxyUsdtAddress,
    constructorArguments: [
        foxyUsdt.runner.address
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
