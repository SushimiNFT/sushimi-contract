import hre from "hardhat";
import { deploy } from "./deploy";

const IPFS_LINK = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";

export default async function main() {
  const [NFTContract, TokenContract] = await deploy();

  await NFTContract.deployTransaction.wait(3);
  await hre.run(`verify:verify`, {
    address: TokenContract.address,
    network: hre.network,
  });
  await hre.run(`verify:verify`, {
    address: NFTContract.address,
    network: hre.network,
    constructorArguments: [IPFS_LINK, TokenContract.address],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
