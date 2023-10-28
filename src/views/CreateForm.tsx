import Image from "next/image";
import { useState, useEffect } from "react";
// @ts-ignore
import { Web3Storage } from "web3.storage";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../constant/contractAddress";
import ABI from "../contract/abi.json";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/router";

export default function CreateForm() {
  const [icon, setIcon] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [lens, setLens] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const { address } = useAccount();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState();
  const router = useRouter();

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = (e.target as HTMLInputElement).files!;
    if (process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN != null) {
      const client = new Web3Storage({
        token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN,
      });
      client.put(files).then((cid: String) => {
        setIcon(`https://${cid}.ipfs.w3s.link/${files[0].name}`);
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
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.createProfile(userName, metaDataUrl, address);
      if (tx) {
        setIsSuccess(true);
      } else {
        setIsError(true);
      }
    } catch (error: any) {
      setError(error);
      setIsError(true);
    }
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
      address: address,
    };

    if (process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN != null) {
      const client = new Web3Storage({
        token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN,
      });
      client
        .put([new File([JSON.stringify(profile)], `${userName}.json`)])
        .then(async (cid: any) => {
          try {
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

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(false);
      toast.success("Profile created successfully", {
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
      router.push(`/${userName}`);
    }
    if (isError) {
      setIsLoading(false);
      toast.error(
        (error as any).message.split("(")[0]?.toString() ||
          "Something went wrong",
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

  return (
    <section className="bg-gray-900 py-24">
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
                      <span className="flex w-[70%] md:w-[100%]">
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
                      </span>
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
                        setIsLoading(true);
                        send();
                      }}
                      className="inline-flex items-center justify-center w-full px-4 py-4 mt-2 text-base font-semibold text-white transition-all duration-200 bg-violet-500 border border-transparent rounded-md focus:outline-none hover:bg-violet-600 focus:bg-violet-600"
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
                          Magic happening...
                        </span>
                      ) : (
                        "Create"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </section>
  );
}
