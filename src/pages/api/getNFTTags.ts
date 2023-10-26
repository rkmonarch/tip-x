import { data } from "autoprefixer";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

interface FloorPrice {
  address: string;
  symbol: string;
  value: string;
}

interface NFT {
  contract_address: string;
  floor_prices: FloorPrice[];
  image_uri: string;
}

let NFTList: NFT[] = [];

interface NFTResponse {
  code: number;
  message: string;
  data: NFT[];
  next_page: number;
  count: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = axios.create({
    baseURL: "https://api.chainbase.online/v1/account/tokens",
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_CHAINBASE_API_KEY as string,
    },
  });

  const NFTapi = axios.create({
    baseURL: "https://api.chainbase.online/v1/account/nfts",
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_CHAINBASE_API_KEY as string,
    },
  });

  let tags: string[] = [];
  const { address } = req.query;

  try {
    const { data: tokenInfoResponse } = await api.get("", {
      params: {
        chain_id: "1",
        address: address,
      },
    });

    const { data: nftResponse } = await NFTapi.get("", {
      params: {
        chain_id: "1",
        address: address,
      },
    });

    const formattedNfts = nftResponse as NFTResponse;

    const filteredNFTs = formattedNfts.data.map((nft) => {
      if (nft.floor_prices != null && nft.floor_prices.length > 0) {
        if (parseFloat(nft.floor_prices[0].value) > 0.03) {
          NFTList.push({
            contract_address: nft.contract_address,
            floor_prices: nft.floor_prices,
            image_uri: nft.image_uri,
          });
        }
      }
    });

    if (NFTList.length > 3) {
      tags.push("NFT degen");
    }

    if (tokenInfoResponse.code === 0) {
      tokenInfoResponse.data.filter((token: any) => {
        console.log(token.contract_address);
        if (
          token.contract_address ===
          "0xb24cd494fae4c180a89975f1328eab2a7d5d8f11"
        ) {
          const numberValue = parseInt(token.balance, 16) / 1000000000000000000;
          if (numberValue >= 400) {
            tags.push("D_D");
          }
        }
      });
    }

    console.log(tags);
    res.status(200).json({
      code: 200,
      message: "Success",
      data: tags,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
};
