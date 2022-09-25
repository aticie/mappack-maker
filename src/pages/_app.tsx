import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <title>Next.js Template</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
