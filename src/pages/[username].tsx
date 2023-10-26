import User from "@/views/User";
import { useEffect } from "react";

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

  try {
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default function Profile({ parsedData }: { parsedData: UserAccount }) {
  useEffect(() => {
    if (parsedData) console.log("userData", parsedData);
  }, [parsedData]);

  return <User parsedData={parsedData} />;
}
