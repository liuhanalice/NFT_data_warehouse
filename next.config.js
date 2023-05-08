/** @type {import('next').NextConfig} */
require("dotenv").config();

const nextConfig = {
  reactStrictMode: true,
  env: {
    INFURA_API_KEY : process.env.INFURA_API_KEY,
    MNEMONIC : process.env.MNEMONIC,
    JWT : process.env.JWT,
    pinataGatewayToken: process.env.pinataGatewayToken
  },
}

module.exports = nextConfig
