import { errorMessages, slippageOptions } from "@/constants";
import useSlippage from "@/hooks/useSlippage";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";

export default function SlippageModal() {
  const { slippage, slippageState, setSlippage, toogleState } = useSlippage();
  const [outline, setOutline] = useState(false);
  const [error, setError] = useState({ error: false, message: "" });

  const handleClose = () => {
    toogleState(false);
  };

  useEffect(() => {
    if (Number(slippage) > 0) {
      if (Number(slippage) < 0.5) {
        setError({ error: true, message: errorMessages[1] });
      } else if (Number(slippage) > 0.5) {
        setError({ error: true, message: errorMessages[0] });
      } else {
        setError({ error: false, message: "" });
      }
    }
  }, [slippage]);

  return (
    <Transition appear show={slippageState} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => toogleState(false)}
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
              <Dialog.Panel className="w-full max-w-md h-[220px] transform overflow-hidden rounded-2xl bg-white border-black/50 dark:bg-neutral-800 border dark:border-white/10 p-0 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-base font-medium leading-6 flex flex-row justify-between px-6 pt-4"
                >
                  <div> Slippage Tolerance</div>
                  <XMarkIcon
                    onClick={handleClose}
                    className="w-7 stroke-2 p-1 transition-all hover:bg-neutral-200 hover:dark:bg-gray-100/20 rounded-full cursor-pointer"
                  />
                </Dialog.Title>
                <div className="rounded-lg bg-gray-200 dark:bg-black mx-4 p-1 flex flex-row space-x-3 items-center mt-5 transition-all">
                  {slippageOptions.map((option) => (
                    <button
                      onClick={() => {
                        setSlippage(Number(option?.slippage));
                        setOutline(false);
                        const elem = document.getElementById("slippageId");
                        //@ts-ignore
                        elem.value = null;
                      }}
                      className={`p-2 text-black dark:text-white rounded-lg px-4 transition-all ${
                        slippage == option?.id
                          ? "bg-yellow-400 dark:bg-gray-600"
                          : " "
                      }`}
                      key={option?.id}
                    >
                      {option?.id === "Auto" ? option?.id : option?.id + "%"}
                    </button>
                  ))}
                  <div
                    className={`w-full px-2 py-1 ${
                      outline
                        ? "border-2 border-yellow-400 rounded-md"
                        : "border-none"
                    }`}
                  >
                    <input
                      type="number"
                      id="slippageId"
                      onChange={(e) => {
                        const value = e.currentTarget.value;
                        const minValue = 0;
                        const maxValue = 50;

                        // Convert value to a number and check if it's within the specified range
                        const parsedValue = parseInt(value);
                        if (isNaN(parsedValue) || parsedValue < minValue) {
                          //@ts-ignore
                          e.currentTarget.value = minValue;
                        } else if (parsedValue > maxValue) {
                          //@ts-ignore
                          e.currentTarget.value = maxValue;
                        } else {
                          setSlippage(e.currentTarget.value);
                          if (Number(e.currentTarget.value) > 0) {
                            setOutline(true);
                          }
                        }
                      }}
                      min="0"
                      max="50"
                      className={`outline-none bg-transparent border-none w-full text-center`}
                      placeholder="Custom"
                    />
                  </div>
                </div>
                <div className="mx-2 mt-4">
                  {error.error ? (
                    <div className="bg-red-100 border border-red-400 rounded-lg text-red-700 px-4 py-3 text-sm flex items-center flex-row">
                      <ExclamationTriangleIcon className="w-8 text-red-700 mr-2" />
                      {error.message}
                    </div>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
