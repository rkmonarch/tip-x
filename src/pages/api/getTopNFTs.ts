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

export default async (req: NextApiRequest, res: NextApiResponse<NFTResponse>) => {
  const api = axios.create({
    baseURL: "https://api.chainbase.online/v1/account/nfts",
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_CHAINBASE_TOKEN as string,
    },
  });

  const { address } = req.query;

  try {
    const { data: nftResponse } = await api.get("", {
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
                    image_uri: nft.image_uri
                });
            }
        }

    });    

    res.status(200).json({
        code: 200,
        message: "Success",
        data: NFTList,
        next_page: 0,
        count: NFTList.length,
    });
  } catch (error) {
    console.error("Error fetching NFT data:", error);
  }
};
