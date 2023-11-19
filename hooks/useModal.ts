import { ModalStore } from '@/types'
import { create } from 'zustand'

const useModal = create<ModalStore>((set) => ({
    modalState:false,
    modalIndex: 0,
    toogleModal:(state:boolean) => set({modalState : state}),
    toogleIndex:(index: number | string) => set({ modalIndex: index})
}))
export default useModal