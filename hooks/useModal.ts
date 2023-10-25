import { create } from 'zustand'

const useStore = create((set) => ({
  open: false,
  increasePopulation: () => set((state: {open:boolean}) => ({ open: state.open })),
  removeAllBears: () => set({ open: false }),
}))
