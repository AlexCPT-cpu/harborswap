import { fee } from "@/config";
import { Quote } from "@/types";
import axios from "axios";

const getQuote = async (
  source: string,
  destination: string,
  amount: string,
  chainId: number
) => {
  const { data } = await axios.post(
   `/api/quote`,{
    chainId, source, destination, amount, fee 
   }
  );
  return data;

};

export default getQuote;
