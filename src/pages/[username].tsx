import User from "@/views/User";
import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "../constant/contractAddress";
import { use, useEffect, useState } from "react";

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

export const getServerSideProps = async (context: any) => {
  const username = context.query.username;
  console.log("username", username);
  return {
    props: {
      username: username,
    },
  };
}



export default function Profile({ username }: { username: string }) {
  const [parsedData, setParsedData] = useState<UserAccount>();
  const {data, isError, isLoading} = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: "getProfile",
    args: [username],
    onError: (error) => {
      console.log("error",error);
    },
    onSuccess: (data: any) => {
      console.log("data", data.cid);
    }
  });

  const fetchData = async () => {
    try {
      const link = data.cid;
      const response = await fetch(link);
      const Data: UserAccount = await response.json();
      console.log("Data", Data);
      setParsedData(Data);
    } catch (error) {
      return {
        notFound: true,
      };
    }
  }

useEffect(() => {
  fetchData();
},[data]);
  useEffect(() => {
    if (parsedData) console.log("userData", parsedData);
  }, [parsedData]);
  return <User parsedData={parsedData} />;
}
