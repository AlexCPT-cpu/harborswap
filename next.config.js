/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "assets.coingecko.com",
      "coingecko.com",
      "raw.githubusercontent.com",
      "githubusercontent.com",
      "arbitrum.foundation",
      "s2.coinmarketcap.com",
      "ethereum-optimism.github.io",
      "tokens.1inch.io",
      "tokens.1inch.io",
      "tokens.1inch.io",
    ],
  },
};

module.exports = nextConfig;
