import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { moralisArray } from "@/config";
import { kv } from "@vercel/kv";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const sessionQuote = await kv.get("moralis");

    const { contract, address, spender } = req.body;

    const apiUrl = `https://deep-index.moralis.io/api/v2.2/erc20/${contract}/allowance`;
    const chain = "eth";

    const response = await axios.get(apiUrl, {
      params: {
        chain,
        owner_address: address,
        spender_address: spender,
      },
      headers: {
        accept: "application/json",
        "X-API-Key": moralisArray[Number(sessionQuote)],
      },
    });
    if (Number(sessionQuote) === moralisArray.length - 1) {
      await kv.set("moralis", "0");
    } else {
      await kv.set("moralis", String(Number(sessionQuote) + 1));
    }
    res.status(200).json(response?.data?.allowance);
  }
}
