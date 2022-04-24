import { fstat, writeFileSync } from "fs";
import request, { gql } from "graphql-request";
import { parseBalanceMap } from "./merkle/parse-balance-map";

const AMOUNT = BigInt(5) * BigInt(1e16); // 0.05ETH

const query = gql`
  query commitments {
    commitments(
      first: 1000
      where: { auction: "0x5089729df58c7f992f3fa6a6f8a51304a814e958" }
    ) {
      user {
        id
      }
      amount
    }
  }
`;

const API = "https://api.thegraph.com/subgraphs/name/sushiswap/miso-ethereum";

async function main() {
  const { commitments } = await request(API, query);

  const formatted = commitments
    .map((commitment: any) => ({
      user: commitment.user.id,
      amount: Number(BigInt(commitment.amount) / AMOUNT),
    }))
    .filter((e: any) => e.amount > 0);

  const merkleInput = formatted.reduce(
    (acc: any, cur: any) => ({
      ...acc,
      [cur.user]: "0x" + cur.amount.toString(16),
    }),
    {} as Record<string, string>
  );

  merkleInput["0x6b83270726342E02a11E755e8CC35275712122eC"] = "0x1"; // My address for testing
  const tree = parseBalanceMap(merkleInput);

  writeFileSync("merkle.json", JSON.stringify(tree, null, 2));
}

main();
