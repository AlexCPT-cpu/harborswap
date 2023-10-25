import { Coin } from "@/types";
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";

const Coin = ({ coin }: { coin: Coin }) => {
  return (
    <div className="flex flex-row transition-all items-center pl-1 pr-3 ml-2 justify-between cursor-pointer dark:bg-black bg-white hover:bg-neutral-200/70  dark:hover:bg-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-700 border-black dark:border-neutral-800/90 py-1 border rounded-full space-x-2">
      <div>
        {coin.icon ? (
          <Image
            className=""
            width={50}
            height={50}
            alt="cointImg"
            src={coin.icon}
          />
        ) : (
          <div>
            <QuestionMarkCircleIcon className="w-7" />
          </div>
        )}
      </div>
      <div className="flex flex-row items-center space-x-2">
        <div className="font-semibold text-lg pr-1">{coin.symbol}</div>
        <div>
          <ChevronDownIcon className="w-4 font-extrabold text-3xl stroke-2" />
        </div>
      </div>
    </div>
  );
};

export default Coin;
