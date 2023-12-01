import type { NextApiRequest, NextApiResponse } from "next";
import rateLimit from "express-rate-limit";
import axios from "axios";

const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

export default async function handler(
  req: NextApiRequest | any,
  res: NextApiResponse | any
) {
  if (req.method === "GET") {
const data = await axios.get("https://proxy-app.1inch.io/v1.0/v1.5/chain/1/router/v5/quotes?fromTokenAddress=0x6b175474e89094c44da98b954eedeac495271d0f&toTokenAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&amount=1000000000000000000&gasPrice=83521095314&preset=maxReturnResult", {
  headers: {
    "Authorization" : "Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjAuV1JtYVN4YjhTMjVvTGlzUVlPeTlHS3l5ZDFGRl8wckVMT2ZLY2lLcTVBNkFabGNXbDUwVl9jcUtaRTh2Szd1X01YMnZwdVFfOWpRMm1ieGo0dTBoSzYwbXB3SmV6YUlNR1V5RnNRXzlEanZLUTJCYkhoVlBxYTdCNHF0RXNYQTFlSm5QWS1FUk4zeklHTTJJd3dfUFdRbHFic1VsNlJvZW5yQ0dFZVd4MjdpYnVWVFJnSXotd1lCQVNPQ2ItdnhVVVJ3SDdfMGQ0M2JoYlhQU1cwc0d6cDRZTDVlaEg5U0RfY2sybDd3S0IzX0dpMi1qaVhaQ2lyVnBFV0pDVHNOajE4alBDNTF6RkhJQnp3Y2FwWG5uSUJIMG9LbGd3ekswa1l1UmU4MUdCRzhCcjl1TWFQd2JzS1MyOTVESGNVYjNLbUhKRGlqRldxczNYdEw3YVVodG1Oc0piamlNZkRUb3gzUlB3MGM0WjhoSUs0MF9KZHBfeWZNaTgtZ19yTkVLYlUxWjQ0eXBHLXkyN2V3a0ppSU9fZGhKcEVKYVVHQ2NhRm5keXFxNGFtOUJBVEUwbXlER0hqbGJ4X0VNSFFXYi5IcWl2ZHlKZV9WUFdBdUpqU2U1Q0pRLjY5ZDg1NzkzNzg4ZTY4ODc2YWVlZjlhMDgyZGIzNjQ0NDlhZTFjNDI1ZTdkMWFmZWUwNjY4MGFlZmUyYTgyN2IiLCJleHAiOjE3MDE0NTIzOTIsImlhdCI6MTcwMTQ1MTc5M30.5FSsbDMZLCyc-UnZciGb1eobwDWnpsf4yKWC9NEE9ZW5sY-y042OenBgJvNAjLFxPlxXfwZWsjLWf6vPOl-Zow"
  }
})
        res.status(200).json({ message: "API response" });

  }
}
