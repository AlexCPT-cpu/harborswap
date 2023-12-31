import { delay } from "@/helpers/delay";
import { Alchemy, Network } from "alchemy-sdk";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { contract } = req.body;
    const randomNumber = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
   await delay(randomNumber)
    const config = {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);

    const response = await alchemy.core.getTokenMetadata(contract);

    res.status(200).json(response);
  }
}
