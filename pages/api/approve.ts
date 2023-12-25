import { bearerArray } from "@/config";
import { Quote } from "@/types";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { delay } from "@/helpers/delay";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Quote | any>
) {
  if (req.method === "POST") {
    const randomNumber = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;

    await delay(randomNumber);

    const sessionQuote = await kv.get("quote");
    const { token } = req.body;

    const response = await axios.get(
      "https://api.1inch.dev/swap/v5.2/1/approve/transaction",
      {
        params: {
          tokenAddress: token,
        },
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

    res.status(200).json(response?.data);
  }
}
