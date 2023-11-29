import type { NextApiRequest, NextApiResponse } from "next";
import rateLimit from "express-rate-limit";

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
    globalLimiter(req, res, (err) => {
      if (err) {
        // If error (rate limit exceeded), send a 429 (Too Many Requests) response
        res
          .status(429)
          .json({ message: "Too many requests, please try again later." });
      } else {
        // Your API logic here
        res.status(200).json({ message: "API response" });
      }
    });
  } else {
    // Handle other HTTP methods if needed
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
