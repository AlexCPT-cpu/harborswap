import { LiquidityStore } from "@/types";
import { create } from "zustand";

const useLiquidity = create<LiquidityStore>((set) => ({
  noLiquidity: false,
  setNoLiquidity: (state: boolean) => set({ noLiquidity: state }),
}));
export default useLiquidity;
