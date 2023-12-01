import axios from "axios";
export const getQuote = async ({
  source,
  destination,
  amount,
}: {
  source: string;
  destination: string;
  amount: string;
}) => {
  if (source === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
    const { data } = await axios.get(
      `https://fusion.1inch.io/quoter/v1.0/${process.env.NEXT_PUBLIC_CHAINID}/quote/receive?walletAddress=0x0000000000000000000000000000000000000000&fromTokenAddress=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&toTokenAddress=${destination}&amount=${amount}&enableEstimate=false`
    );

    const largeNumber = BigInt(data?.toTokenAmount);
    const percentage =
      (largeNumber) * (BigInt(process.env.NEXT_PUBLIC_FEE!) / BigInt(100));
      const returned = largeNumber - percentage
      return String(returned);
  } else if (destination === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
    const { data } = await axios.get(
      `https://fusion.1inch.io/quoter/v1.0/${process.env.NEXT_PUBLIC_CHAINID}/quote/receive?walletAddress=0x0000000000000000000000000000000000000000&fromTokenAddress=${source}&toTokenAddress=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&amount=${amount}&enableEstimate=false`
    );

    const largeNumber = BigInt(data?.toTokenAmount);
    const percentage =
    (largeNumber) * (BigInt(process.env.NEXT_PUBLIC_FEE!) / BigInt(100));
    const returned = largeNumber - percentage
    return String(returned);
  } else {
    const { data } = await axios.get(
      `https://fusion.1inch.io/quoter/v1.0/${process.env.NEXT_PUBLIC_CHAINID}/quote/receive?walletAddress=0x0000000000000000000000000000000000000000&fromTokenAddress=${source}&toTokenAddress=${destination}&amount=${amount}&enableEstimate=false`
    );

    const largeNumber = BigInt(data?.toTokenAmount);
    const percentage =
    (largeNumber) * (BigInt(process.env.NEXT_PUBLIC_FEE!) / BigInt(100));
    const returned = largeNumber - percentage
    return String(returned);
  }
};
