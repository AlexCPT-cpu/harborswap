import { Coin } from "@/types";
import axios from "axios";

const inchQuote = async (
  coinIn: Coin,
  coinOut: Coin,
  bigIntNumber: bigint,
  setPrice: (price: string | number) => void,
  setRatio: (ratio: string | number) => void
) => {
  const { data } = await axios.post("/api/quote", {
    chainId: 1,
    source: coinIn?.address,
    destination: coinOut?.address,
    amount: bigIntNumber.toString(),
    fee: process.env.NEXT_PUBLIC_FEE,
  });
  const outDecimals = 10 ** Number(coinOut?.decimals);
  const parsed = parseInt(data?.toAmount) / outDecimals;
  setPrice(parsed);
  setRatio(parsed);
};

export default inchQuote;
