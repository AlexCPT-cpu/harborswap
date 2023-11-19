import { Coin, CoinStore } from '@/types'
import { create } from 'zustand'

const useCoin = create<CoinStore>((set) => ({
    coinIn:{
        logoURI:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        symbol:"ETH",
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        decimals:18
    },
    coinOut:Object,
    handleIn:(coin:Coin) => set({coinIn : coin}),
    handleOut:(coin:Coin) => set({coinOut : coin})
}))
export default useCoin