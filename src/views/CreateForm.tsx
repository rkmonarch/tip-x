import Image from "next/image";
import { useState } from "react";
// @ts-ignore
import { Web3Storage } from "web3.storage";
import { useAccount } from "wagmi";
import { useContractWrite } from "wagmi";
import { ethers } from "ethers";
import {CONTRACT_ADDRESS} from "../constant/contractAddress";
import ABI from '../contract/abi.json'


export default function CreateForm() {
  const [icon, setIcon] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [lens, setLens] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [cid, setCid] = useState("");
  const {address} = useAccount();



  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = (e.target as HTMLInputElement).files!;
    if (process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN != null) {
      const client = new Web3Storage({
        token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN,
      });
      client.put(files).then((cid: String) => {
        console.log(cid);
        setIcon(`https://${cid}.ipfs.w3s.link/${files[0].name}`);
        console.log(`https://${cid}.ipfs.w3s.link/${files[0].name}`);
      });
    } else {
      console.log("No access token");
    }
  };

  const callContract = async (metaDataUrl: string) => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      signer
    );
    contract
      .createProfile(userName, metaDataUrl, "0x63989a803b61581683B54AB6188ffa0F4bAAdf28")
      .then(async (tx: string) => {
        {
          if (tx) {
           console.log(tx);
          }
        }
      });
  };


  const send = async () => {
    const profile = {
      profileImage: icon,
      userName: userName,
      name: name,
      bio: bio,
      email: email,
      lens: lens,
      twitterUrl: twitterUrl,
      githubUrl: githubUrl,
      address: "0x63989a803b61581683B54AB6188ffa0F4bAAdf28",
    };

    if (process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN != null) {
      const client = new Web3Storage({
        token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN,
      });
      client
        .put([new File([JSON.stringify(profile)], `${userName}.json`)])
        .then(async (cid: any) => {
          try {
            console.log(cid);
            setCid(cid);
            const metaDataUrl = `https://${cid}.ipfs.w3s.link/${userName}.json`;
            callContract(metaDataUrl);
          } catch (error) {
            console.log("Error", error);
          }
        });
    } else {
      console.log("No access token");
    }
  };



  return (
    <section className="py-10 bg-gray-900 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-teal-200 sm:text-4xl lg:text-5xl">
            Your social flex
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-gray-300 text-lg leading-relaxed">
            Brag your work to the most exciting audience on Ethereum and earn
            hefty rewards in ETH. Build, Share & Grow!
          </p>
        </div>
        <div className="max-w-5xl mx-auto mt-6 sm:mt-8">
          <div className="mt-6 overflow-hidden bg-white rounded-xl">
            <div className="px-6 py-12 sm:p-12">
              <form action="#" method="POST">
                <div className="flex justify-center mb-5">
                  <div className="flex flex-row items-center space-x-2">
                    <Image
                      className="mx-auto object-cover rounded-3xl border-2 border-violet-400 shadow-md"
                      src={icon !== "" ? icon : "/preview.svg"}
                      loader={({ src }) => src}
                      alt="profile"
                      width={150}
                      height={150}
                    />
                    <div className="flex flex-col space-y-2">
                      <label className="text-base font-medium text-gray-900">
                        Upload your pfp
                      </label>
                      <input
                        className="p-2 text-xs text-violet-600 border border-violet-300 rounded-xl cursor-pointer bg-violet-50 focus:outline-none"
                        id="image"
                        name="image"
                        type="file"
                        accept={"image/*"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          uploadImage(e)
                        }
                        required
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                  <div>
                    <label className="text-base font-medium text-gray-900">
                      {" "}
                      Your name{" "}
                    </label>
                    <div className="mt-2.5 relative">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        placeholder="Enter your full name"
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        className="w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-violet-500 caret-violet-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-900">
                      {" "}
                      Email address{" "}
                    </label>
                    <div className="mt-2.5 relative">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        placeholder="javier@tipx.com"
                        className="w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-violet-500 caret-violet-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-900">
                      {" "}
                      Username{" "}
                    </label>
                    <div className="mt-2.5 relative">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.target.value);
                        }}
                        placeholder="Enter a short username"
                        className="w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-violet-500 caret-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-base font-medium text-gray-900">
                      {" "}
                      Twitter Handle{" "}
                    </label>
                    <div className="mt-2.5 relative">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={twitterUrl}
                        onChange={(e) => {
                          setTwitterUrl(e.target.value);
                        }}
                        placeholder="Enter your twitter handle"
                        className="w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-violet-500 caret-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-base font-medium text-gray-900">
                      {" "}
                      Lens Handle{" "}
                    </label>
                    <div className="mt-2.5 relative">
                      <input
                        type="text"
                        name="Lens"
                        id="Lens"
                        value={lens}
                        onChange={(e) => {
                          setLens(e.target.value);
                        }}
                        placeholder="Enter your lens handle"
                        className="w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-violet-500 caret-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-base font-medium text-gray-900">
                      GitHub Profile{" "}
                    </label>
                    <div className="mt-2.5 relative">
                      <input
                        type="text"
                        name="githubUrl"
                        id="githubUrl"
                        value={githubUrl}
                        onChange={(e) => {
                          setGithubUrl(e.target.value);
                        }}
                        placeholder="Enter your GitHub handle"
                        className="w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-violet-500 caret-violet-500"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-base font-medium text-gray-900">
                      {" "}
                      Bio{" "}
                    </label>
                    <div className="mt-2.5 relative">
                      <textarea
                        name="bio"
                        id="bio"
                        value={bio}
                        onChange={(e) => {
                          setBio(e.target.value);
                        }}
                        placeholder="Be unique, short and pitch yourself"
                        className="w-full px-4 py-2 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md resize-y focus:outline-none focus:border-violet-500 caret-violet-500"
                        rows={4}
                      ></textarea>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      onClick={(e: any) => {
                        e.preventDefault();
                        send();
                      }}
                      className="inline-flex items-center justify-center w-full px-4 py-4 mt-2 text-base font-semibold text-white transition-all duration-200 bg-violet-500 border border-transparent rounded-md focus:outline-none hover:bg-violet-600 focus:bg-violet-600"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
