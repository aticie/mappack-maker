import type { NextPage } from "next";
import Head from "next/head";
import HomePage from "@components/HomePage";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>osu! Mappack Downloader</title>
        <meta name="description" content="Generate zip files from mapset ids." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
    </div>
  );
};

export default Home;
