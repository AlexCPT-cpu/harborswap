export interface TabProps {
    active: string,
    setActive: (selected: string) => void
}

export interface Coin {
    icon: string,
    symbol: string,
    contract?: string
}

export interface SwapInput {
    headline: string,
    amount: string | number,
    setAmount: (amt: string | number) => void,
    usdValue: string | number,
    balance: string | number,
    coin: Coin
}