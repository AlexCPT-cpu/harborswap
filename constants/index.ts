export const slippageOptions = [{
    id:"Auto",
    slippage:0.5,
    warning:false
},{
    id:"0.1",
    slippage:0.1,
    warning:true
},{
    id:"0.5",
    slippage:0.5,
    warning:false
},
,{
    id:"1",
    slippage:1,
    warning:true
}]

export const errorMessages = ["Transaction might be frontrun because of high slippage tolerance.", "Transaction might be reverted because of low slippage tolerance."]