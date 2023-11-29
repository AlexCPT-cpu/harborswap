import React, { useCallback, useEffect, useRef, useState } from "react";
import SwapInput from "./SwapInput";
import useCoin from "@/hooks/useCoin";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { GiGasPump } from "react-icons/gi";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import useAmounts from "@/hooks/useAmounts";
import getQuote from "@/hooks/useQuote";
import { Oval } from "react-loader-spinner";
import { readContract, erc20ABI } from "@wagmi/core";
import { getAccount } from "@wagmi/core";
import { chainAddress, oneInchContract } from "@/config";
import useLiquidity from "@/hooks/useLiquidity";

const SwapModule = () => {
  const { coinIn, coinOut, handleIn, handleOut } = useCoin();
  const {
    amountIn,
    amountOut,
    handleIn: handleAmountIn,
    handleOut: handleAmountOut,
  } = useAmounts();
  const [loading, setLoading] = useState<boolean>();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [appproval, setApproval] = useState({
    amount: 0,
    wei: "",
  });
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const { noLiquidity, setNoLiquidity } = useLiquidity();
  const [rate, setRate] = useState<number>(0);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const qte = useCallback(
    async (amt: number, wei: string) => {
      setLoading(true);
      if (coinIn.address && coinOut.address) {
        if (Number(amt) > 0) {
          const price = await getQuote(
            coinIn.address,
            coinOut.address,
            String(wei),
            1
          );
          return price;
        } else {
          setPrice(0);
        }
      }
      setLoading(false);
    },
    [coinIn, coinOut]
  );

  const [price, setPrice] = useState<string | number>(0);

  const handleAmtIn = (amt: string | number, wei: string | number) => {
    setNoLiquidity(false);
    setLoading(true);
    handleAmountIn(amt, wei);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        makeAPICall(amt, wei);
      }, 2000)
    );
    if (!loading) {
      // qte(Number(amt), String(wei))
      //   .then((value) => {
      //     if (value) {
      //       const decimal = 10 ** coinOut?.decimals;
      //       const parsed = parseInt(value?.toAmount) / decimal;
      //       const input = document.getElementById("inputAmt1");
      //       //@ts-ignore
      //       input.value = parsed.toFixed(3).toLocaleString();
      //       setPrice(parsed / Number(amt));
      //       handleAmountOut(parsed, value);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     setNoLiquidity(true);
      //   })
      //   .finally(() => setLoading(false));
    } else {
      console.log("loading Price");
    }
  };
  const toogleSwap = () => {
    setNoLiquidity(false);
    const ina = amountIn;
    const out = amountOut;
    handleIn(coinOut);
    handleOut(coinIn);
    handleAmountIn(out.amount, out.amountWei);
    handleAmountOut(ina.amount, ina.amountWei);
    setPrice(Number(ina.amount) / Number(out.amount));
  };
  const account = getAccount();

  const makeAPICall = (searchValue: any, anotherVal: any) => {
    console.log("Making API call with search value:", searchValue, anotherVal);
  };

  useEffect(() => {
    const get = async () => {
      setNoLiquidity(false);
      setApproveLoading(true);
      const data = await readContract({
        //@ts-ignore
        address: coinIn.address,
        abi: erc20ABI,
        functionName: "allowance",
        args: [account?.address!, oneInchContract],
      });
      const decimal = 10 ** Number(coinIn?.decimals);
      const approvedValue = Number(data) / decimal;
      setApproval({
        amount: approvedValue,
        wei: String(Number(data)),
      });
      setApproveLoading(false);
      //console.log(approvedValue >= Number(amountIn?.amount));
    };
    if (coinIn.address === chainAddress) {
      console.log("cannot get allowance for native balance");
    } else {
      if (coinIn.address) {
        get();
      }
    }
  }, [account.address, coinIn, amountIn, setNoLiquidity]);

  return (
    <div>
      <div className="mt-3 relative">
        <div>
          <SwapInput
            headline="You pay"
            amount={amountIn.amount}
            setAmount={handleAmtIn}
            coin={coinIn}
            index={0}
          />
        </div>
        <div
          onClick={toogleSwap}
          className="absolute cursor-pointer transition-all ring-4 rounded-xl ring-white dark:ring-black top-[30%] left-[47%] z-10"
        >
          <div className="p-2 dark:bg-neutral-900 bg-gray-100 rounded-xl">
            <ArrowDownIcon className="w-5" />
          </div>
        </div>

        <div className="mt-1">
          <SwapInput
            headline="You receive"
            amount={amountOut.amount}
            setAmount={handleAmountOut}
            coin={coinOut}
            index={1}
          />
        </div>
        {Number(price) > 0 && !loading ? (
          <div
            className={`${
              Number(price) > 0 ? "flex" : "hidden"
            } px-4 w-full flex-row justify-between items-center dark:bg-neutral-900 bg-gray-100 py-3 rounded-2xl mt-1 text-center text-[14px] transition-all cursor-pointer`}
          >
            <div>
              1 {/**@ts-ignore */}
              {coinIn.symbol} ={" "}
              {Number(amountIn?.amount) ? price.toLocaleString() : 0}{" "}
              {coinOut.symbol} ($224.96)
            </div>
            <div className="flex flex-row items-center space-x-1">
              <div className="flex items-center">
                <GiGasPump size={16} />
              </div>
              <div>${isNaN(rate) ? 0 : rate.toFixed(2)}</div>
              <div>
                <ChevronDownIcon className="w-5 stroke-3" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div
                className={`
        w-full flex flex-row justify-between items-center dark:bg-neutral-900 bg-gray-100 py-3 rounded-2xl mt-1 text-[14px] transition-all cursor-pointer`}
              >
                <div className="pl-4">Fetching Best Price... </div>
                <div className="flex flex-row items-center space-x-1">
                  <Oval
                    height={25}
                    width={80}
                    color="#facc15"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#808080"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                </div>
              </div>
            ) : null}
          </>
        )}

        {noLiquidity ? (
          <button
            disabled={true}
            className={`px-4 w-full flex flex-col py-4 rounded-2xl mt-2 items-center justify-center font-bold text-xl text-center transition-all bg-yellow-400 disabled:cursor-not-allowed disabled:bg-gray-400`}
          >
            No Liquidity
          </button>
        ) : (
          <>
            {isApproved ? (
              <button
                disabled={loading}
                className={`px-4 w-full flex flex-col py-4 rounded-2xl mt-2 items-center justify-center font-bold text-xl text-center transition-all bg-yellow-400 disabled:cursor-not-allowed disabled:bg-gray-400`}
              >
                Swap
              </button>
            ) : (
              <>
                {coinOut?.address && Number(amountIn.amount) > 0 ? (
                  <button
                    disabled={approveLoading}
                    className={`px-4 w-full flex flex-col py-4 rounded-2xl mt-2 items-center justify-center font-bold text-xl text-center transition-all bg-yellow-400 disabled:cursor-not-allowed disabled:bg-gray-400`}
                  >
                    Approve
                  </button>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SwapModule;
