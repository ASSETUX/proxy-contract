import { ethers } from "hardhat";

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", owner.address);
  console.log("otherAccount ", otherAccount);
  console.log("Account balance:", (await owner.getBalance()).toString());

  const Cs = await ethers.getContractFactory("Transfer");
  const cs = await Cs.deploy();

  console.log("Contact address:", cs.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
