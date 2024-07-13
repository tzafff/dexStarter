const express = require("express");
const Moralis = require("moralis").default;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Use CORS middleware to handle CORS issues
app.use(cors({
  origin: 'https://dex-web3.vercel.app', // Your frontend URL
  optionsSuccessStatus: 200
}));

app.use(express.json());

app.get("/tokenPrice", async (req, res) => {
  const { query } = req;

  try {
    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressOne,
    });

    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressTwo,
    });

    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice,
      tokenTwo: responseTwo.raw.usdPrice,
      ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
    };

    return res.status(200).json({ usdPrices });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while fetching token prices." });
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls on port ${port}`);
  });
});