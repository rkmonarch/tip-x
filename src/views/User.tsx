import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { BsTwitter, BsGithub } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import Header from "@/components/Header";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { CONTRACT_ADDRESS } from "../constant/contractAddress";
import ABI from "../contract/abi.json";
import { utils } from "ethers";
import { Toaster, toast } from "react-hot-toast";

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
          className="w-64 h-60 bg-teal-50 object-contain rounded-xl shadow-lg"
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

export default function User({
  parsedData,
}: {
  parsedData: UserAccount | undefined;
}) {
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
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getTags = async (address: any) => {
    const data = await fetch(`/api/getNFTTags?address=${address}`, {
      method: "GET",
    });
    const tag = await data.json();
    const tagsList: string[] = [];
    if (tag.length > 0 && tagsList.length != tag.length) {
      tag.map((t: string) => {
        tagsList.push(t);
      });
    }
    setTags(tagsList);
  };

  const getTopNFTs = async (address: any) => {
    const data = await fetch(`/api/getTopNFTs?address=${address}`, {
      method: "GET",
    });
    const nfts = await data.json();
    const nftsList: NFTCard[] = [];
    if (nfts.length > 0) {
      nfts.map((nft: any) => {
        nftsList.push({
          image: nft.image_uri,
          name: nft.name,
        });
      });
    }
    setNftsData(nftsList);
  };

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    value: utils.parseEther(amount.toString()).toBigInt(),
    abi: ABI,
    functionName: "addMessage",
    args: [
      userName,
      "Sending money",
      utils.parseEther(amount.toString()).toBigInt(),
    ],
  });

  const { data: msgData, write, error } = useContractWrite(config);

  const {
    isLoading: isMsgLoading,
    isSuccess,
    isError,
  } = useWaitForTransaction({
    hash: msgData?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(false);
      setModal(false);
      toast.success("Sent successfully", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          boxShadow: "0 0 64px rgba(0, 0, 0, 0.5)",
        },
        iconTheme: {
          primary: "#1ad320",
          secondary: "#fff",
        },
      });
    }
    if (isError) {
      setIsLoading(false);
      toast.error("Transaction failed", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          boxShadow: "0 0 64px rgba(0, 0, 0, 0.5)",
        },
        iconTheme: {
          primary: "red",
          secondary: "#fff",
        },
      });
    }
    if (error) {
      setIsLoading(false);
      toast.error(
        error.message.split(".")[0]?.toString() || "Something went wrong",
        {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            boxShadow: "0 0 64px rgba(0, 0, 0, 0.5)",
          },
          iconTheme: {
            primary: "red",
            secondary: "#fff",
          },
        }
      );
    }
  }, [isSuccess, isError, error]);

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
        setUserName(parsedData.userName);
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
        <div className="flex flex-col sm:flex-row items-center p-8 pt-24 px-2 justify-center bg-[#fefefe] sm:space-x-10 rounded border-t-[1px] border-gray-300">
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
            <p className="text-gray-600 font-medium text-sm md:text-2xl mb-4">
              {bio}
            </p>
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
                href={"https://github.com/" + githubUrl}
                className="p-2 w-fit text-sm border border-gray-700 rounded-full hover:bg-teal-500 hover:border-teal-500 hover:text-white"
              >
                <BsGithub size={20} />
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
              } fixed justify-center items-center backdrop-blur-sm z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0 max-h-full`}
            >
              <div className="relative w-full max-w-md max-h-full">
                <div className="relative rounded-lg shadow bg-gray-900">
                  <button
                    type="button"
                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                    data-modal-hide="authentication-modal"
                    onClick={() => {
                      setModal(false);
                      setIsLoading(false);
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
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
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
                          setIsLoading(true);
                          write?.();
                        }}
                        type="submit"
                        className="w-full text-white bg-violet-500 focus:ring-1 focus:outline-none hover:bg-violet-600 focus:ring-violet-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        {isLoading ? (
                          <span className="flex gap-1 items-center justify-center">
                            <svg
                              aria-hidden="true"
                              role="status"
                              className="inline mr-2 w-4 h-4 text-gray-100 animate-spin"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="#2dd4bf"
                              ></path>
                            </svg>{" "}
                            Sending...
                          </span>
                        ) : (
                          "Send tip"
                        )}
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
      <Toaster />
    </>
  );
}
