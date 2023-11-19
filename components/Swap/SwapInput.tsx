import { SwapInput } from "@/types";
import Coin from "./Coin";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import useModal from "@/hooks/useModal";
import { useEffect, useState } from "react";
import geckoTerminal from "@/helpers/geckoTerminal";
import { chainAddress, chainId } from "@/config";
import { erc20ABI } from "wagmi";
import { getAccount, readContract } from "@wagmi/core";
import { fetchBalance } from "@wagmi/core";

const SwapInput = ({ headline, amount, setAmount, coin, index }: SwapInput) => {
  const account = getAccount();
  const { toogleModal, toogleIndex } = useModal();
  const [usdValue, setUsdValue] = useState<number>(0);
  const [balance, setBalance] = useState({ amount: 0, wei: "0" });

  const handleToogle = () => {
    toogleModal(true);
    toogleIndex(index);
  };
  useEffect(() => {
    const getPrice = async () => {
      const price = await geckoTerminal("eth", coin?.address!);
      setUsdValue(Number(price));
      if (coin?.address !== chainAddress) {
        const data: BigInt = await readContract({
          address: coin?.address!,
          abi: erc20ABI,
          functionName: "balanceOf",
          args: [account?.address!],
        });
        const decimal = 10 ** Number(coin?.decimals);
        setBalance({
          amount: Number(data) / decimal,
          wei: String(Number(data)),
        });
        console.log(data);
      } else {
        const balance = await fetchBalance({
          address: account?.address!,
          chainId: chainId,
          formatUnits: "wei",
        });
        setBalance({
          amount: Number(balance.formatted),
          wei: String(Number(balance.value)),
        });
      }
    };
    if (coin?.address) {
      getPrice();
    }
  }, [coin, account.address]);
  console.log(balance);
  return (
    <div className="px-4 transition-all text-[14px] w-full flex flex-col dark:bg-neutral-900 bg-gray-100 py-4 rounded-2xl">
      <h4 className="text-neutral-500 dark:text-neutral-100/40">{headline}</h4>
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-row w-full justify-between items-center mt-1 mb-3">
          <div>
            <input
              className="outline-none bg-transparent w-full text-4xl dark:placeholder:text-neutral-100/20 placeholder:text-neutral-400"
              placeholder="0"
              type="number"
              id={`inputAmt${index}`}
              onChange={(e) => {
                const decimals = 10 ** Number(coin?.decimals);
                setAmount(
                  Number(e.currentTarget.value),
                  String(Number(e.currentTarget.value) * decimals)
                );
              }}
            />
          </div>
          <div>
            {coin?.symbol ? (
              <Coin onClick={handleToogle} coin={coin} />
            ) : (
              <div
                onClick={handleToogle}
                className="bg-yellow-400 flex flex-row transition-all items-center pl-1 pr-3 ml-2 justify-between cursor-pointer dark:bg-black hover:bg-neutral-200/70  dark:hover:bg-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-700 border-black dark:border-neutral-800/90 py-1 border rounded-full space-x-2"
              >
                <div></div>
                <div className="flex flex-row items-center space-x-2 group">
                  <div className="font-semibold text-sm pr-1 whitespace-nowrap py-1 group-hover:text-black dark:group-hover:text-white text-white">
                    Select Token
                  </div>
                  <div>
                    <ChevronDownIcon className="w-4 text-white group-hover:text-black dark:group-hover:text-white font-extrabold text-3xl stroke-2" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row w-full items-center justify-between text-neutral-500 dark:text-neutral-100/40">
          <div>
            {coin?.decimals
              ? isNaN(Number(amount) * Number(usdValue))
                ? 0
                : (Number(amount) * Number(usdValue)).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
              : 0}
          </div>

          <div>
            Balance:{" "}
            {coin?.decimals
              ? isNaN(balance.amount)
                ? 0
                : balance?.amount.toLocaleString("en-US", {})
              : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapInput;
