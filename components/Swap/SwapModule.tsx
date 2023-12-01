import { chainAddress, oneInchContract } from "@/config";
import geckoTerminal from "@/helpers/geckoTerminal";
import { getQuote } from "@/helpers/getQuote";
import useAmounts from "@/hooks/useAmounts";
import useCoin from "@/hooks/useCoin";
import useLiquidity from "@/hooks/useLiquidity";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { erc20ABI, getAccount, readContract } from "@wagmi/core";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { GiGasPump } from "react-icons/gi";
import { Oval } from "react-loader-spinner";
import SwapInput from "./SwapInput";

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
  const [outPrice, setOutPrice] = useState(0);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);

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
          const price = await getQuote({
            source: coinIn.address,
            destination: coinOut.address,
            amount: String(wei),
          });
          return price;
        } else {
          setPrice(0);
        }
      }
      setLoading(false);
    },
    [coinIn, coinOut]
  );

  const getQ = useCallback(
    async (source: string, destination: string, wei: string) => {
      const price = await getQuote({
        source,
        destination,
        amount: String(wei),
      });
      return price;
    },
    []
  );

  const [price, setPrice] = useState<string | number>(0);

  const handleAmtIn = (amt: string | number, wei: string | number) => {
    if (Number(amt) === 0) {
      handleAmountOut(0, "0");
      console.log("do nothing");
      return;
    } else {
      setLoading(false);
      setNoLiquidity(false);
      setLoading(true);
      handleAmountIn(amt, wei);

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      setTypingTimeout(
        setTimeout(() => {
          //@ts-ignore
          const [base, exponent] = wei.split("e");
          const bigIntNumber = BigInt(base + "0".repeat(exponent));
          //@ts-ignore
          qte(Number(amt), bigIntNumber.toString())
            .then((value) => {
              if (value) {
                const decimal = 10 ** Number(coinOut?.decimals);
                const parsed = parseInt(value) / decimal;
                const input = document.getElementById("inputAmt1");
                //@ts-ignore
                input.value = parsed.toFixed(7);
                setPrice(parsed / Number(amt));
                handleAmountOut(parsed, value);
              }
            })
            .catch((error) => {
              //console.log(error);
              setNoLiquidity(true);
            })
            .finally(() => {
              setLoading(false);
            });
        }, 3000)
      );
    }
  };

  const toogleSwap = () => {
    setLoading(true);
    setNoLiquidity(false);
    const ina = amountIn;
    const out = amountOut;
    const cOut = coinIn;
    const cIn = coinOut;
    handleIn(coinOut);
    handleOut(coinIn);
    handleAmountIn(out.amount, out.amountWei);
    handleAmountOut(ina.amount, ina.amountWei);
    const input = document.getElementById("inputAmt0");
    //@ts-ignore
    input.value = out.amount;
    const input2 = document.getElementById("inputAmt1");
    //@ts-ignore
    input2.value = ina.amount;
    //setPrice(Number(ina.amount) / Number(out.amount));

    setTimeout(() => {
      //@ts-ignore
      const [base, exponent] = out.amountWei.split("e");
      const bigIntNumber = BigInt(base + "0".repeat(exponent));
      //@ts-ignore
      getQ(cIn.address, cOut.address, bigIntNumber.toString())
        .then((value) => {
          if (value) {
            const outDecimals = 10 ** Number(cOut?.decimals);
            const parsed = parseInt(value) / outDecimals;
            const amtIn = Number(out.amount) / parsed;
            const input4 = document.getElementById("inputAmt0");
            //@ts-ignore
            input4.value = (amtIn * parsed).toFixed(7);
            const input3 = document.getElementById("inputAmt1");
            //@ts-ignore
            input3.value = parsed.toFixed(7);
            setPrice(parsed / Number(out.amount));
            handleAmountOut(parsed, value);
          }
        })
        .catch((error) => {
          setNoLiquidity(true);
        })
        .finally(() => setLoading(false));
    }, 1000);
  };
  const account = getAccount();

  useEffect(() => {
    const get = async () => {
      setNoLiquidity(false);
      setApproveLoading(true);
      try {
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
      } catch (error) {
        const { data } = await axios.post("/api/approval", {
          contract: coinIn.address,
          address: account?.address,
          spender: oneInchContract,
        });
        const decimal = 10 ** Number(coinIn?.decimals);
        const approvedValue = Number(data) / decimal;
        setApproval({
          amount: approvedValue,
          wei: String(Number(data)),
        });
        setApproveLoading(false);
      }

      //console.log(approvedValue >= Number(amountIn?.amount));
    };
    if (coinIn.address === chainAddress) {
      console.log("cannot get allowance for native balance");
    } else {
      if (coinIn.address) {
        get();
      }
    }
  }, [account.address, coinIn, setNoLiquidity]);

  useEffect(() => {
    const changeRate = async () => {
      const price = await geckoTerminal("eth", coinOut?.address!);
      setOutPrice(price);
    };
    changeRate();
  }, [coinOut]);

  return (
    <div>
      <div className="mt-3 relative">
        <div>
          <SwapInput
            loading={loadingInitial}
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
            loading={loadingQuote}
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
              {Number(amountIn?.amount) ? Number(price).toFixed(6) : 0}{" "}
              {coinOut.symbol} ($
              {Number(amountIn?.amount)
                ? (Number(price) * Number(outPrice)).toLocaleString()
                : 0}
              )
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
            Insufficient Liquidity
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
                {coinIn?.address !== chainAddress ? (
                  <>
                    {(coinIn?.address &&
                      Number(appproval.amount) < Number(amountIn.amount)) ||
                    Number(appproval.amount) === 0 ? (
                      <button
                        disabled={approveLoading}
                        className={`px-4 w-full flex flex-col py-4 rounded-2xl mt-2 items-center justify-center font-bold text-xl text-center transition-all bg-yellow-400 disabled:cursor-not-allowed disabled:bg-gray-400`}
                      >
                        Approve
                      </button>
                    ) : null}
                  </>
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
