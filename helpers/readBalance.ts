import { erc20ABI } from "wagmi";
import { readContract } from "@wagmi/core";

const readBalance = async (account: string, coin: string) => {
  const data: BigInt = await readContract({
    //@ts-ignore
    address: coin,
    abi: erc20ABI,
    functionName: "balanceOf",
    //@ts-ignore
    args: [account],
  });
  return data;
};

export default readBalance;
