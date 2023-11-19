import axios from 'axios';

const geckoTerminal = async (network: string, address: string) => {
  try {
    const { data } = await axios.get(
      `https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${address}`
    );
    return data?.data?.attributes?.price_usd;
  } catch (error: any) {
    console.log(error.message);
  }
};
    export default geckoTerminal;
