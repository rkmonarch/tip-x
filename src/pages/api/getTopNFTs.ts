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
  name: string;
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
      console.log(nft.name);
        if (nft.floor_prices != null && nft.floor_prices.length > 0) { 
            if (parseFloat(nft.floor_prices[0].value) > 0.03 && nft.image_uri != '') {
                NFTList.push({
                    contract_address: nft.contract_address,
                    floor_prices: nft.floor_prices,
                    image_uri: nft.image_uri,
                    name: nft.name
                });
            }
        }

    });    

    res.status(200).json(NFTList.slice(0, 5));
  } catch (error) {
    console.error("Error fetching NFT data:", error);
  }
};
