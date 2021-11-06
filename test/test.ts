import type { Contract } from "@ethersproject/contracts";
import { expect } from "chai";

import { deploy } from "../scripts/deploy";

declare module "mocha" {
  export interface Context {
    sushimi: Contract;
    token: Contract;
    baseURI: string;
    totalSupply: number;
  }
}

describe("Sushimi", function () {
  beforeEach("", async function () {
    [this.sushimi, this.token] = await deploy();
    this.baseURI = await this.sushimi.functions.baseURI();
    this.totalSupply =
      (await this.token.functions.totalSupply()) /
      10 ** (await this.token.functions.decimals());
  });

  it("Should return the correct tokenURI", async function () {
    expect(await this.sushimi.tokenURI(0)).to.equal("");
    const index = Number(
      (await (await this.sushimi.mint(1)).wait()).logs[1].topics[3]
    );
    expect(await this.sushimi.tokenURI(index)).to.equal(
      this.baseURI + String(index)
    );
    expect(await this.sushimi.tokenURI(1)).to.equal("");
  });

  it("Shouldn't mint one NFT twice", async function () {
    this.timeout(0);

    const indexes = (
      await (await this.sushimi.mint(this.totalSupply)).wait()
    ).logs
      .filter(
        (log: any) =>
          log.topics[0] ===
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
          log.address === this.sushimi.address
      ) // Transfer on the NFT contract
      .map((log: any) => Number(log.topics[3]));

    const uniqueIndexes = [...new Set(indexes)];
    expect(indexes.lenth === uniqueIndexes.length);
  });
});
