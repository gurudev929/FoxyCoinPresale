// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hardhat = require("hardhat");
const foxyCoinAddress = "0x7f3b6Fd6797bF90eA4425b4960142b7F60971472";

async function main() {
  const preVenda = await hardhat.ethers.getContractFactory("PreVenda");
  console.log(`Deploying contract with the account: ${preVenda.runner.address}`);

  const deplyedPreVenda = await preVenda.deploy(preVenda.runner.address, foxyCoinAddress);
  await deplyedPreVenda.waitForDeployment();

  let deplyedPreVendaAddress = await deplyedPreVenda.getAddress();
  console.log(`Contract deployed to ${deplyedPreVendaAddress} on ${hardhat.network.name}`);

  const WAIT_BLOCK_CONFIRMATIONS = 6;
  await deplyedPreVenda.deploymentTransaction().wait(WAIT_BLOCK_CONFIRMATIONS);

  console.log(`Verifying contract on ${hardhat.network.name}...`);
  await hardhat.run(`verify:verify`, {
    address: deplyedPreVendaAddress,
    constructorArguments: [
      preVenda.runner.address,
      foxyCoinAddress
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
