import { bearerArray } from "@/config";
import { Quote } from "@/types";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Quote | any>
) {
  if (req.method === "POST") {
    const sessionQuote = await kv.get("quote");
    const { chainId, source, destination, amount, fee } = req.body;
 
    const { data } = await axios.get(
      `https://api.1inch.dev/swap/v5.2/${chainId}/quote?src=${source}&dst=${destination}&amount=${amount}&fee=${fee}`,
      {
        headers: {
          Authorization: `Bearer ${bearerArray[Number(sessionQuote)]}`,
          Accept: "application/json",
        },
      }
    );
    if (Number(sessionQuote) === bearerArray.length - 1) {
      await kv.set("quote", "0");
    } else {
      await kv.set("quote", String(Number(sessionQuote) + 1));
    }

    res.status(200).json(data);
  }
}
