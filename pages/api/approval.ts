import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { moralisArray } from "@/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const key = moralisArray[0]
    const { contract, address, spender } = req.body;

    const apiUrl =
      `https://deep-index.moralis.io/api/v2.2/erc20/${contract}/allowance`;
    const chain = "eth";

    const response = await axios.get(apiUrl, {
      params: {
        chain,
        owner_address: address,
        spender_address: spender,
      },
      headers: {
        accept: "application/json",
        "X-API-Key": key,
      },
    });

    res.status(200).json(response?.data?.allowance);
  }
}
