import CreateForm from "@/views/CreateForm";
import Header from "@/components/Header";
import Head from "next/head";

export default function CreateProfile() {
  return (
    <>
      <Head>
        <title>Create Profile</title>
        <meta name="description" content="tipland" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <CreateForm />
    </>
  );
}
