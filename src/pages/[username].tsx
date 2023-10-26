import User from "@/views/User";

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

export default function Profile({ parsedData }: { parsedData: UserAccount }) {
  return <User parsedData={parsedData} />;
}
