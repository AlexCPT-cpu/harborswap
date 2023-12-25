import { FeeAddr, bearerArray, fee } from "@/config";
import { delay } from "@/helpers/delay";
import { Quote } from "@/types";
import { kv } from "@vercel/kv";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Quote | any>
) {
  if (req.method === "POST") {
    const randomNumber = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;

    await delay(randomNumber);

    const sessionQuote = await kv.get("quote");
    const { source, destination, amount, slippage, address } = req.body;

    const response = await axios.get("https://api.1inch.dev/swap/v5.2/1/swap", {
      headers: {
        Authorization: `Bearer ${bearerArray[Number(sessionQuote)]}`,
      },
      params: {
        src: source,
        dst: destination,
        amount: amount,
        from: address,
        slippage: slippage,
        fee: fee,
        includeTokensInfo: true,
        includeGas: true,
        referrer: FeeAddr,
      },
    });

    if (Number(sessionQuote) === bearerArray.length - 1) {
      await kv.set("quote", "0");
    } else {
      await kv.set("quote", String(Number(sessionQuote) + 1));
    }
    res.status(200).json(response.data);
  }
}
