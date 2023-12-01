import useModal from "@/hooks/useModal";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import primary from "@/constants/primary.json";
import { tokenList } from "@/constants/tokenlist";
import CoinCol from "./CoinCol";
import Coin from "./Coin";
import useCoin from "@/hooks/useCoin";
import useLiquidity from "@/hooks/useLiquidity";
import validateAddress from "@/helpers/validateAddress";

export default function TokenModal() {
  const { modalState, toogleModal, modalIndex, toogleIndex } = useModal();
  const { handleIn, handleOut, coinIn, coinOut } = useCoin();
  const [input, setInput] = useState<string>("");
  const { setNoLiquidity } = useLiquidity();
  const [searched, setSearched] = useState<any>();

  const handleCoinSelect = (coin: Coin, index: number | string) => {
    setNoLiquidity(false);
    if (index) {
      handleOut(coin);
      toogleModal(false);
    } else {
      handleIn(coin);
      toogleModal(false);
    }
  };

  const handleClose = () => {
    toogleIndex(modalIndex);
    toogleModal(false);
  };

  const isAddress = useMemo(() => {
    const validate = validateAddress(input);
    return validate;
  }, [input]);

  const filter = useMemo(() => {
    tokenList.filter((token) => {
      if (token.address === input) {
        setSearched(token);
      } else {
        setSearched({});
      }
    });
  }, [input]);

  console.log(searched);
  return (
    <Transition appear show={modalState} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => toogleModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md h-[700px] transform overflow-hidden rounded-2xl bg-white border-black/50 dark:bg-neutral-800 border dark:border-white/10 p-0 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-base font-medium leading-6 flex flex-row justify-between px-6 pt-4"
                >
                  <div> Select a token</div>
                  <XMarkIcon
                    onClick={handleClose}
                    className="w-7 stroke-2 p-1 transition-all hover:bg-neutral-200 hover:dark:bg-gray-100/20 rounded-full cursor-pointer"
                  />
                </Dialog.Title>
                <div className="mt-5 px-6">
                  <SearchBar input={input!} setInput={setInput} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-b pt-3 pb-5 px-6 border-b-black/50 dark:border-b-white/10">
                  {primary.map((token, index) => {
                    const disabled =
                      token?.address === coinIn?.address ||
                      token?.address === coinOut?.address;

                    return (
                      <Coin
                        disabled={disabled}
                        onClick={() => handleCoinSelect(token, modalIndex)}
                        coin={token}
                        key={index}
                      />
                    );
                  })}
                </div>
                {isAddress ? (
                  <div className="mt-4 flex w-full flex-col pb-15 h-[420px] border-b-black/50 dark:border-b-white/1 overflow-auto space-y-2 scroll-smooth transition-all">
                    {tokenList?.map((token, index) => {
                      const disabled =
                        token?.address === coinIn?.address ||
                        token?.address === coinOut?.address;
                      return (
                        <CoinCol
                          disabled={disabled}
                          onClick={() => handleCoinSelect(token, modalIndex)}
                          coin={token}
                          key={index}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex justify-center mt-20 font-bold text-xl transition-all">
                    Invalid Address
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
