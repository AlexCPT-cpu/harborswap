import { AmountStore } from "@/types";
import { create } from "zustand";

const useAmounts = create<AmountStore>((set) => ({
  amountIn: { amount: 0, amountWei: "0" },
  amountOut: { amount: 0, amountWei: "0" },
  handleIn: (amt: string | number, wei: string | number) =>
    set({
      amountIn: {
        amount: amt,
        amountWei: wei,
      },
    }),
  handleOut: (amt: string | number, wei: string | number) =>
    set({
      amountOut: {
        amount: amt,
        amountWei: wei,
      },
    }),
}));
export default useAmounts;
