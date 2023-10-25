import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import React from "react";
import SwapModule from "./SwapModule";

const SwapCard = () => {
  return (
    <div className="mt-20 w-[480px] border border-yellow-300/50 dark:border-yellow-300/10 rounded-3xl p-2">
      <div className="flex flex-row justify-between p-4">
        <div className="flex flex-row justify-between space-x-3">
          <div>Swap</div>
          <div>Buy</div>
        </div>

        <div>
          <Cog6ToothIcon className="w-6" />
        </div>
      </div>
      <SwapModule />
    </div>
  );
};

export default SwapCard;
