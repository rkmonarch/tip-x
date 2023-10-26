import Hero from "@/views/Hero";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>TipX</title>
        <meta name="description" content="TipX" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
    </>
  );
}
