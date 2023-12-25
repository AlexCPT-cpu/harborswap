import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import SwapModule from "./SwapModule";
import useSlippage from "@/hooks/useSlippage";

const SwapCard = () => {
  const { toogleState } = useSlippage();
  return (
    <div className="mt-20 w-full lg:w-[480px] border border-yellow-300/50 dark:border-yellow-300/10 rounded-3xl h-full">
      <div className="flex flex-row justify-between p-4">
        <div className="flex flex-row justify-between space-x-3">
          <div className="cursor-pointer">Swap</div>
          <div className="cursor-pointer">Buy</div>
        </div>

        <div onClick={() => toogleState(true)}>
          <Cog6ToothIcon className="w-6 cursor-pointer" />
        </div>
      </div>
      <SwapModule />
    </div>
  );
};

export default SwapCard;
