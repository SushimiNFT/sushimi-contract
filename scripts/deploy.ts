import { ethers } from "hardhat";
import type { Contract } from "ethers";

const IPFS_LINK = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";

export async function deploy(): Promise<Contract[]> {
  const Token = await ethers.getContractFactory("SushimiToken");
  const TokenContract = await Token.deploy();

  const NFT = await ethers.getContractFactory("Sushimi");
  const NFTcontract = await NFT.deploy(IPFS_LINK, TokenContract.address);

  await TokenContract.functions.transferOwnership(NFTcontract.address);

  return [NFTcontract, TokenContract];
}
