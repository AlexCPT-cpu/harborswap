import { Coin } from "@/types";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import CoinImg from "../Swap/CoinImg";

const CoinCol = ({
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
      className="flex flex-row justify-between transition-all items-center pl-1 pr-1 cursor-pointer hover:bg-neutral-200/70  dark:hover:bg-white/10 active:bg-neutral-100 dark:active:bg-neutral-700 py-1 space-x-2 px-6 w-full disabled:bg-neutral-400/70  disabled:dark:bg-neutral-400/70 disabled:cursor-not-allowed"
    >
      <div className="flex flex-row w-full items-center px-2">
        <div onClick={() => {}}>
          {coin.logoURI ? (
            <CoinImg
              name={coin.name!}
              ring={true}
              width={38}
              height={38}
              src={coin.logoURI}
            />
          ) : (
            <div>
              <QuestionMarkCircleIcon className="w-7" />
            </div>
          )}
        </div>
        <div className="flex flex-col items-start space-x-2 text-left pl-2 justify-start">
          <div className="text-[12px] text-start font-semibold">
            {coin.name}
          </div>
          <div className="text-[10px] text-start">{coin.symbol}</div>
        </div>
      </div>

      <div className="items-end w-ful px-2">{coin.balance ?? 0}</div>
    </button>
  );
};

export default CoinCol;
