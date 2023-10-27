import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import Header from "@/components/Header";
import { useRouter } from "next/router";

interface UserAccount {
  profileImage: string;
  userName: string;
  name: string;
  bio: string;
  email: string;
  lens: string;
  githubUrl: string;
  twitterUrl: string;
  address: string;
}

interface NFTCard {
  image: string;
  name: string;
  // url: string;
}

const Card: FC<NFTCard> = ({ image, name }) => {
  return (
    <Link
      className="w-full md:w-[22%] mb-5 p-2 bg-white border border-gray-100 rounded-xl shadow-lg flex flex-col"
      href={""}
    >
      <div className="flex flex-col items-center mt-2 space-y-2">
        <Image
          className="w-64 h-60 object-contain rounded-xl shadow-lg"
          src={image}
          loader={({ src }) => src}
          width={250}
          height={250}
          alt="nft"
          onClick={() => {
            // window.open(url, "_blank");
          }}
        />
        <p className="text-lg text-slate-900 font-regular">{name}</p>
      </div>
    </Link>
  );
};

export default function User({ parsedData }: { parsedData: UserAccount | undefined }) {
  const router = useRouter();
  const { username } = router.query;
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [icon, setIcon] = useState("");
  const [lens, setLens] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [modal, setModal] = useState(false);
  const [nftsData, setNftsData] = useState<NFTCard[]>([]);
  const [tags, setTags] = useState<string[]>([]);



  const getTags = async (address: any) => {
    const data = await fetch(`/api/getNFTTags?address=${address}`, {
      method: "GET",
    });
    // console.log("data", data);
    const tag = await data.json();
    const tagsList: string[] = [];
   if (tag.length > 0 && tagsList.length != tag.length) {
     tag.map((t: string) => {
       tagsList.push(t);
     });
   }
    setTags(tagsList);
    console.log("tags", tags);
  };

  const getTopNFTs = async (address: any) => {
    const data = await fetch(`/api/getTopNFTs?address=${address}`, {
      method: "GET",
    });
    const nfts = await data.json();
    const nftsList: NFTCard[] = [];
    if (nfts.length > 0 ) {
      nfts.map((nft: any) => {
        console.log("nft", nft);
        nftsList.push({
          image: nft.image_uri,
          name: nft.name,
          // url: nft.collection.marketplace_pages[0].collection_url,
        });
      });
    }
    setNftsData(nftsList);
    console.log("nfts", nftsData);
  };
  
useEffect(() => {
  if (parsedData) {
    try {
      setName(parsedData.name);
      setBio(parsedData.bio);
      setIcon(parsedData.profileImage);
      setLens(parsedData.lens);
      setGithubUrl(parsedData.githubUrl);
      setTwitter(parsedData.twitterUrl);
      setEmail(parsedData.email);
      getTags(parsedData.address);
      getTopNFTs(parsedData.address);
    } catch (e) {
      console.log(e);
  }
  }
   
}, [parsedData]);
  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name="description" content="TipX" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-[100vh] max-w-full bg-[#F8F7FF]">
        <Header />
        <div className="flex flex-col sm:flex-row items-center p-8 pt-20 px-2 justify-center bg-[#fefefe] sm:space-x-10 rounded border-t-[1px] border-gray-300">
          <Image
            src={icon}
            loader={() => icon}
            width="250"
            height="250"
            alt="TipX"
            className="w-60 h-60 object-cover sm:mr-3 justify-center mb-5 sm:mb-0 rounded-full"
          />
          <span className="flex flex-col text-center sm:text-left text-2xl font-semibold whitespace-nowrap">
            <p className="font-bold text-5xl mb-1">{name}</p>
            <p className="text-gray-600 font-medium text-2xl mb-4">{bio}</p>
            <div className="flex flex-row justify-center sm:justify-start space-x-2">
              <Link
                href={"https://twitter.com/" + twitter}
                className="p-2 w-fit text-sm border border-gray-700 rounded-full hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:text-white"
              >
                <BsTwitter size={20} />
              </Link>
              <Link
                href={"mailto:" + email}
                className="p-2 w-fit text-sm border border-gray-700 rounded-full hover:bg-violet-500 hover:border-violet-500 hover:text-white"
              >
                <FiMail size={20} />
              </Link>
              <Link
                href={"https://www.lens.xyz/" + lens}
                className="w-fit text-sm border border-gray-700 rounded-full hover:bg-lime-300 hover:border-lime-300 hover:text-white"
              >
                <Image src="/lens.png" height={36} width={36} alt="social" />
              </Link>
            </div>
            <div className="flex flex-col md:flex-row items-center mt-2 space-y-1 md:space-y-0 md:space-x-1 ">
              {tags.map((tag: string, index: any) => (
                <p
                  key={index}
                  className="w-fit p-1 px-2 text-base font-medium bg-violet-200 border border-violet-500 rounded-full"
                >
                  {tag}
                </p>
              ))}
            </div>
            <div className="flex flex-auto md:justify-start justify-center">
              <button
                data-modal-target="authentication-modal"
                data-modal-toggle="authentication-modal"
                className="block w-fit mt-4 md:mt-2 text-violet-500 hover:text-white border border-violet-300 hover:bg-violet-500 focus:ring-1 focus:outline-none focus:ring-violet-500 font-medium rounded-2xl text-sm px-4 p-1 text-center"
                type="button"
                onClick={() => {
                  setModal(true);
                }}
              >
                Give thanks
              </button>
            </div>
            <div
              id="authentication-modal"
              aria-hidden="true"
              className={`${
                modal ? "flex" : "hidden"
              } fixed justify-center items-center backdrop-blur-sm z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}
            >
              <div className="relative w-full max-w-md max-h-full">
                <div className="relative rounded-lg shadow bg-gray-900">
                  <button
                    type="button"
                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                    data-modal-hide="authentication-modal"
                    onClick={() => {
                      setModal(false);
                    }}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="px-6 py-6 lg:px-8">
                    <h3 className="mb-4 text-xl font-medium text-white">
                      Reward your chad
                    </h3>
                    <form className="space-y-6" action="#">
                      <div>
                        <label className="block mb-2 text-sm font-normal text-gray-300">
                          Number which can make em happy
                        </label>
                        <input
                          onChange={(e) => {
                            setAmount(parseInt(e.target.value));
                          }}
                          type="number"
                          name="amount"
                          id="amount"
                          className="bg-gray-50 border border-slate-400 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-range-500 block w-full p-2.5"
                          placeholder="4 ETH"
                          required
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          console.log("amount", amount);
                        }}
                        type="submit"
                        className="w-full text-white bg-violet-500 focus:ring-1 focus:outline-none hover:bg-violet-600 focus:ring-violet-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Send tip
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </div>
        <div className="p-5 md:p-10 space-y-2">
          <p className="text-2xl font-medium text-center md:text-start">
            Your top collection
          </p>
          <hr className="my-12 h-[0.5px] border-t-0 bg-gray-300 opacity-90" />
          <div className="flex flex-row flex-wrap items-center justify-between bg-[#F8F7FF]">
            {nftsData.map((nft: NFTCard, i) => (
              <Card key={i} image={nft.image} name={nft.name} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
