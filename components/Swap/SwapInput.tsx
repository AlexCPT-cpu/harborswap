import { SwapInput } from "@/types";
import Coin from "./Coin";

const SwapInput = ({
  headline,
  amount,
  setAmount,
  usdValue,
  balance,
  coin,
}: SwapInput) => {
  return (
    <div className="px-4 text-[14px] w-full flex flex-col dark:bg-neutral-900 bg-gray-100 py-4 rounded-2xl">
      <h4 className="text-neutral-500 dark:text-neutral-100/40">{headline}</h4>
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-row w-full justify-between items-center mt-1 mb-3">
          <div>
            <input
              className="outline-none bg-transparent w-full text-4xl dark:placeholder:text-neutral-100/20 placeholder:text-neutral-400"
              placeholder="0"
              type="number"
              onChange={(e) => {
                setAmount(e.currentTarget.value);
              }}
            />
          </div>
          <div>
            <Coin coin={coin} />
          </div>
        </div>
        <div className="flex flex-row w-full items-center justify-between text-neutral-500 dark:text-neutral-100/40">
          <div>${(Number(amount) * Number(usdValue)).toLocaleString()}</div>

          <div>Balance: {balance.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default SwapInput;
