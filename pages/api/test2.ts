import { bearerArray, moralisArray } from "@/config";
import { Quote } from "@/types";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Quote | any>
) {
  if (req.method === "GET") {
    const sessionQuote = await kv.get("moralis");

    if (Number(sessionQuote) === moralisArray.length - 1) {
      await kv.set("moralis", "0");
    } else {
      await kv.set("moralis", String(Number(sessionQuote) + 1));
    }

    res.status(200).json(sessionQuote);
  }
}
