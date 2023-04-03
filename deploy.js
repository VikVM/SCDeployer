const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = fs.readFileSync("./Note_sol_Note.abi", "utf-8");
  const bin = fs.readFileSync("./Note_sol_Note.bin", "utf-8");

  console.log(abi);
  console.log(bin);

  const contractFactory = new ethers.ContractFactory(abi, bin, account);
  const contract = await contractFactory.deploy();
  //console.log(contract);
  const contractReceipt = await contract.deployTransaction.wait(1);
  console.log(`Contract address ${contract.address}`);

  let myNote = await contract.getNote();
  console.log(`My first note: ${myNote}`);
  const tx = await contract.setNote("Hello World!");
  await tx.wait(1);
  myNote = await contract.getNote();
  console.log(`My second note: ${myNote}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
