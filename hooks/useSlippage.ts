import { SlippageStore } from '@/types'
import { create } from 'zustand'

const useSlippage = create<SlippageStore>((set) => ({
    slippageState:false,
    slippage: 0.5,
    toogleState:(state:boolean) => set({slippageState : state}),
    setSlippage:(index: number | string) => set({ slippage: index})
}))

type x = typeof useSlippage
export default useSlippage