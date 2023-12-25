import { chainAddress, oneInchContract } from "@/config";
import geckoTerminal from "@/helpers/geckoTerminal";
import { getQuote } from "@/helpers/getQuote";
import useAmounts from "@/hooks/useAmounts";
import useCoin from "@/hooks/useCoin";
import useLiquidity from "@/hooks/useLiquidity";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import {
  erc20ABI,
  getAccount,
  readContract,
  prepareSendTransaction,
  sendTransaction,
} from "@wagmi/core";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { GiGasPump } from "react-icons/gi";
import { Oval } from "react-loader-spinner";
import SwapInput from "./SwapInput";
import inchQuote from "@/helpers/inchQuote";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import useSlippage from "@/hooks/useSlippage";
import toast from "react-hot-toast";

const SwapModule = () => {
  const account = getAccount();
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
    amount: 1,
    wei: "",
  });
  const { slippage, slippageState, setSlippage, toogleState } = useSlippage();
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const { noLiquidity, setNoLiquidity } = useLiquidity();
  const [rate, setRate] = useState<number>(0);
  const [ratio, setRatio] = useState<any>(0);
  const [outPrice, setOutPrice] = useState(0);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [gas, setGas] = useState({
    gas: "",
    gasPrice: "",
  });
  const [noFunds, setNoFunds] = useState(false);
  const [txDetails, setTxDetails] = useState({
    to: "",
    data: "null",
    value: "null",
  });
  const [swapDetails, setSwapDetails] = useState({
    to: "",
    data: "null",
    value: "null",
  });

  const { config: approveConfig } = usePrepareContractWrite({
    //@ts-ignore
    address: coinIn?.address, //coinIn?.address,
    abi: erc20ABI,
    functionName: "approve",
    args: [
      oneInchContract,
      BigInt(
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      ),
    ],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(approveConfig);
  const waitForTransaction = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 2,
    onSuccess(data) {
      toast.success("Transaction Successful");
    },
    onError(err) {
      toast.error("Error Approving");
    },
  });

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

  useEffect(() => {
    const getRatio = async () => {
      setLoadingInitial(true);
      setLoadingQuote(true);
      setLoading(false);
      setNoLiquidity(false);
      setLoading(true);
      const inDecimals = 10 ** Number(coinIn?.decimals);
      const one = 1 * inDecimals;
      //@ts-ignore
      const [base, exponent] = one.toString().split("e");
      //@ts-ignore
      const bigIntNumber = BigInt(base + "0".repeat(exponent));
      getQ(coinIn?.address!, coinOut?.address, bigIntNumber.toString())
        .then((value) => {
          if (value) {
            const outDecimals = 10 ** Number(coinOut?.decimals);
            const parsed = parseInt(value) / outDecimals;
            setPrice(parsed);
            setRatio(parsed);
            setLoadingInitial(false);
            setLoadingQuote(false);
          }
        })
        .catch(async (error) => {
          const randomNumber =
            Math.floor(Math.random() * (4000 - 2000 + 1)) + 1000;
          setTimeout(async () => {
            await inchQuote(coinIn, coinOut, bigIntNumber, setPrice, setRatio)
              .then(() => {
                setNoLiquidity(false);
              })
              .catch(async () => {
                setNoLiquidity(true);
              })
              .finally(() => {
                setLoadingInitial(false);
                setLoadingQuote(false);
              });
          }, randomNumber);
        })
        .finally(() => {
          setLoading(false);
          setLoadingInitial(false);
          setLoadingQuote(false);
        })
        .finally(() => {
          setLoading(false);
          setLoadingInitial(false);
          setLoadingQuote(false);
        });
    };

    if (coinIn?.address && coinOut?.address) {
      console.log("finding quote");
      getRatio();
    }
  }, [coinIn, coinOut, getQ, handleAmountOut, setNoLiquidity]);

  useEffect(() => {
    const calcRate = async () => {
      setLoading(true);
      const decimal = 10 ** coinOut?.decimals;
      const parsed = Number(amountIn.amount) * ratio;
      const input = document.getElementById("inputAmt1");
      //@ts-ignore
      input.value = parsed.toFixed(7);
      const wei = parsed * decimal;
      handleAmountOut(parsed, wei);
      setLoading(false);
    };
    if (Number(amountIn.amount) > 0) {
      console.log("finding rate");
      calcRate();
    }
  }, [amountIn, ratio, coinOut, handleAmountOut]);

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
      setLoading(false);
      // setTypingTimeout(
      //   setTimeout(() => {
      //     //@ts-ignore
      //     const [base, exponent] = wei.split("e");
      //     const bigIntNumber = BigInt(base + "0".repeat(exponent));
      //     //@ts-ignore
      //     qte(Number(amt), bigIntNumber.toString())
      //       .then((value) => {
      //         if (value) {
      //           const decimal = 10 ** Number(coinOut?.decimals);
      //           const parsed = parseInt(value) / decimal;
      //           const input = document.getElementById("inputAmt1");
      //           //@ts-ignore
      //           input.value = parsed.toFixed(7);
      //           setPrice(parsed / Number(amt));
      //           handleAmountOut(parsed, value);
      //         }
      //       })
      //       .catch((error) => {
      //         //console.log(error);
      //         setNoLiquidity(true);
      //       })
      //       .finally(() => {
      //         setLoading(false);
      //       });
      //   }, 3000)
      // );
    }
  };

  const toogleSwap = () => {
    setLoading(true);
    setNoLiquidity(false);
    setIsApproved(true);
    handleIn(coinOut);
    handleOut(coinIn);
    handleAmountIn(0, "0");
    handleAmountOut(0, "0");
    const input = document.getElementById("inputAmt0");
    //@ts-ignore
    input.value = null;
    const input2 = document.getElementById("inputAmt1");
    //@ts-ignore
    input2.value = null;
    //setPrice(Number(ina.amount) / Number(out.amount));

    // setTimeout(() => {
    //   //@ts-ignore
    //   const [base, exponent] = out.amountWei.toString().split("e");
    //   //@ts-ignore
    //   const bigIntNumber = BigInt(base + "0".repeat(exponent));
    //   //@ts-ignore
    //   getQ(cIn.address, cOut.address, bigIntNumber.toString())
    //     .then((value) => {
    //       if (value) {
    //         const outDecimals = 10 ** Number(cOut?.decimals);
    //         const parsed = parseInt(value) / outDecimals;
    //         const amtIn = Number(out.amount) / parsed;
    //         const input4 = document.getElementById("inputAmt0");
    //         //@ts-ignore
    //         input4.value = (amtIn * parsed).toFixed(7);
    //         const input3 = document.getElementById("inputAmt1");
    //         //@ts-ignore
    //         input3.value = parsed.toFixed(7);
    //         setPrice(parsed / Number(out.amount));
    //         handleAmountOut(parsed, value);
    //       }
    //     })
    //     .catch((error) => {
    //       setNoLiquidity(true);
    //     })
    //     .finally(() => setLoading(false));
    // }, 1000);
    setLoading(false);
  };

  useEffect(() => {
    const getSwapDetails = async () => {
      if (
        isApproved &&
        coinIn.address &&
        coinOut.address &&
        Number(amountIn.amount) > 0 &&
        account.address
      ) {
        try {
          const [base, exponent] = amountIn.amountWei.toString().split("e");
          //@ts-ignore
          const bigIntNumber = BigInt(base + "0".repeat(exponent));
          const { data: swapD } = await axios.post("/api/swap", {
            source: coinIn.address,
            destination: coinOut.address,
            amount: bigIntNumber.toString(),
            slippage: slippage,
            address: account.address,
          });
          setSwapDetails({
            data: swapD.tx.data,
            to: swapD.tx.to,
            value: swapD.tx.value,
          });
          console.log({ gas: swapD.tx.gas, gasPrice: swapD.tx.gasPrice });
          setGas({ gas: swapD.tx.gas, gasPrice: swapD.tx.gasPrice });
        } catch (error) {
          setNoFunds(true);
        }
      }
    };
    getSwapDetails();
  }, [isApproved, coinIn, coinOut, amountIn, account.address, slippage]);

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
        Number(approvedValue) < Number(amountIn.amount)
          ? setIsApproved(false)
          : setIsApproved(true);
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
        Number(approvedValue) < Number(amountIn.amount)
          ? setIsApproved(false)
          : setIsApproved(true);
        setApproveLoading(false);
      }

      //console.log(approvedValue >= Number(amountIn?.amount));
    };

    if (coinIn?.address === chainAddress) {
      console.log("cannot get allowance for native balance");
      setIsApproved(true);
    } else {
      if (coinIn.address) {
        get();
      }
    }
  }, [account.address, coinIn, setNoLiquidity, setIsApproved, amountIn]);

  useEffect(() => {
    const changeRate = async () => {
      const price = await geckoTerminal("eth", coinOut?.address!);
      setOutPrice(price);
    };
    changeRate();
  }, [coinOut]);

  useEffect(() => {
    const getApprovalData = async () => {
      if (!write && coinIn?.address !== chainAddress) {
        setTimeout(async () => {
          const { data: apprData } = await axios.post("/api/approve", {
            token: coinIn?.address,
          });
          setTxDetails({
            value: apprData?.value,
            data: apprData?.data,
            to: apprData?.to,
          });
        }, 1000);
      } else {
        console.log("preparing");
      }
    };
    getApprovalData();
  }, [write, coinIn]);

  const { data: sendData, sendTransaction: sendApprove } = useSendTransaction({
    from: account.address,
    to: String(txDetails.to),
    //@ts-ignore
    data: String(txDetails.data),
    //@ts-ignore
    value: String(txDetails.value),
  });
  useWaitForTransaction({
    hash: sendData?.hash,
    confirmations: 2,
    onSuccess(data) {
      toast.success("Transaction Successful");
    },
    onError(err) {
      toast.error("Error Approving");
    },
  });

  const { data: sendSwap, sendTransaction: sendSwapTx } = useSendTransaction({
    from: account.address,
    to: String(swapDetails.to),
    //@ts-ignore
    data: String(swapDetails.data),
    //@ts-ignore
    value: String(swapDetails.value),
  });
  useWaitForTransaction({
    hash: sendSwap?.hash,
    confirmations: 2,
    onSuccess(data) {
      toast.success("Swap Successful");
    },
    onError(err) {
      toast.error("Error Swapping");
    },
  });
  // console.log(gas);
  return (
    <div className="px-2 w-full h-full">
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
            <ArrowDownIcon className="w-4 stroke-2 lg:w-5" />
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
        <div className="w-full h-full mb-4">
          {Number(price) > 0 && !loading ? (
            <div
              className={`${
                Number(price) > 0 ? "flex" : "hidden"
              } px-4 w-full flex-row justify-between items-center text-xs lg:text-sm whitespace-nowrap dark:bg-neutral-900 bg-gray-100 py-3 rounded-2xl mt-1 text-center text-[14px] transition-all cursor-pointer`}
            >
              <div className="flex lg:hidden">
                1 {/**@ts-ignore */}
                {coinIn.symbol} = {ratio.toFixed(2)} {coinOut.symbol} ($
                {Number(amountIn?.amount)
                  ? (Number(ratio) * Number(outPrice)).toFixed(2)
                  : 0}
                )
              </div>
              <div className="hidden lg:flex">
                1 {/**@ts-ignore */}
                {coinIn.symbol} = {ratio} {coinOut.symbol} ($
                {Number(amountIn?.amount)
                  ? (Number(ratio) * Number(outPrice)).toLocaleString()
                  : 0}
                )
              </div>
              <div className="flex flex-row items-center space-x-1">
                <div className="flex items-center ml-2">
                  <GiGasPump size={16} />
                </div>
                <div>{(Number(gas.gasPrice) / 1e9).toFixed(2)} Gwei</div>
                <div className="flex justify-center items-center">
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
                  onClick={() => {
                    toast.loading("Loading Swap");
                    sendSwapTx();
                  }}
                  disabled={loading || noFunds}
                  className={`px-4 w-full flex flex-col py-4 rounded-2xl mt-2 items-center justify-center font-bold text-xl text-center transition-all bg-yellow-400 disabled:cursor-not-allowed disabled:bg-gray-400 active:bg-yellow-500 delay-75`}
                >
                  {noFunds ? "Insufficient funds for gas" : "Swap"}
                </button>
              ) : (
                <>
                  {coinIn?.address !== chainAddress ? (
                    <>
                      {(coinIn?.address &&
                        Number(appproval.amount) < Number(amountIn.amount)) ||
                      Number(appproval.amount) === 0 ? (
                        <button
                          disabled={approveLoading || !write}
                          onClick={() => {
                            toast.loading("Loading Approval");
                            !write ? () => sendApprove() : () => write?.();
                          }}
                          className={`px-4 w-full flex flex-col py-4 rounded-2xl mt-2 items-center justify-center font-bold text-xl text-center transition-all bg-yellow-400 disabled:cursor-not-allowed disabled:bg-gray-400 active:bg-yellow-500 delay-75`}
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
    </div>
  );
};

export default SwapModule;
