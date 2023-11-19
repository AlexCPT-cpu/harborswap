import { Coin } from "@/types";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import CoinImg from "../Swap/CoinImg";

const Coin = ({
  coin,
  onClick,
  disabled,
}: {
  coin: Coin;
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex ring-1 ring-black/10 dark:ring-white/10 flex-row transition-all items-center pl-1 pr-1 cursor-pointer dark:bg-black bg-white hover:bg-neutral-200/70  dark:hover:bg-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-700 border-black dark:border-neutral-800/90 py-1 border rounded-full space-x-2 disabled:bg-neutral-400/70  disabled:dark:bg-neutral-400/70 disabled:cursor-not-allowed"
    >
      <div>
        {coin.logoURI ? (
          <CoinImg width={30} height={30} src={coin.logoURI} />
        ) : (
          <div>
            <QuestionMarkCircleIcon className="w-7" />
          </div>
        )}
      </div>
      <div className="flex flex-row items-center space-x-2">
        <div className="text-sm pr-1">{coin.symbol}</div>
      </div>
    </button>
  );
};

export default Coin;
