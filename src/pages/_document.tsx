import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-[url('../assets/bg.jpg')] bg-no-repeat bg-cover bg-center bg-fixed  ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
