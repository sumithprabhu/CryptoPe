require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const ZEEVE_HTTP_URL = "https://app.zeeve.io/shared-api/poly/6565244a68abb41037f8ee09e9770cf7bc8e9af15ff6fff2/";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.19",
  networks: {
    polygon_mumbai: {
      url: ZEEVE_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};