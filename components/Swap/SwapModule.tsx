import React, { useState } from "react";
import SwapInput from "./SwapInput";
import { Coin } from "@/types";
import tokenList from "../../tokenlist.json";

const SwapModule = () => {
  const [amount, setAmount] = useState<string | number>(0);

  const token = tokenList.tokens[1];
  const coin: Coin = {
    icon: token.logoURI,
    symbol: token.symbol,
    contract: token.address,
  };
  return (
    <div>
      <div className="mt-3">
        <SwapInput
          headline="You pay"
          amount={amount}
          balance={4532}
          setAmount={setAmount}
          usdValue={32.97}
          coin={coin}
        />
      </div>
    </div>
  );
};

export default SwapModule;
