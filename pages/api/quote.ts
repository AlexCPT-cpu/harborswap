// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { bearerArray } from '@/config';
import { Quote } from '@/types';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Quote | any>
) {
  if(req.method === "POST") {

  const { chainId, source, destination, amount, fee } = req.body
  const { data } = await axios.get(
   `https://api.1inch.dev/swap/v5.2/${chainId}/quote?src=${source}&dst=${destination}&amount=${amount}&fee=${fee}`,
    {
      headers: {
        Authorization: `Bearer ${bearerArray[0]}`,
        Accept: "application/json",
      },
    }
  );

  res.status(200).json(data)}
}
