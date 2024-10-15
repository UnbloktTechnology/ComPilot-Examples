import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useOpenWidget } from "@compilot/react-sdk";

const Home: NextPage = () => {
  const openWidget = useOpenWidget();
  return (
    <div className={styles.container}>
      <Head>
        <title>ComPilot Next.Js Web3</title>
        <meta content="ComPilot Example" name="description" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <button
          id="compilot-button"
          disabled={openWidget.isPending}
          onClick={() => openWidget.openWidget()}
        >
          Open Widget
        </button>
        <h1 className={styles.title}>
          Welcome to <a href="">ComPilot</a>
          <br /> NextJS Web3 example.
        </h1>

        <p className={styles.description}>
          This example uses RainbowKit and Wagmi. Get started by editing{" "}
          <code className={styles.code}>pages/index.tsx</code>
          <br />
          Check _app.tsx , compilot-config.ts and challenge.ts to work on ComPilot
          integration
        </p>

        <div className={styles.grid}>
          <a className={styles.card} href="https://docs.compilot.ai">
            <h2>ComPilot Documentation &rarr;</h2>
            <p>Learn how to Implement our compliance widget on your App.</p>
          </a>
          <a
            className={styles.card}
            href="https://github.com/UnbloktTechnology/compilot-examples/tree/development/v2"
          >
            <h2>ComPilot Examples &rarr;</h2>
            <p>Discover example ComPilot projects.</p>
          </a>
          <a className={styles.card} href="https://rainbowkit.com">
            <h2>RainbowKit Documentation &rarr;</h2>
            <p>Learn how to customize your wallet connection flow.</p>
          </a>

          <a className={styles.card} href="https://wagmi.sh">
            <h2>Wagmi Documentation &rarr;</h2>
            <p>Learn how to interact with Ethereum.</p>
          </a>

          <a
            className={styles.card}
            href="https://github.com/rainbow-me/rainbowkit/tree/main/examples"
          >
            <h2>RainbowKit Examples &rarr;</h2>
            <p>Discover boilerplate example RainbowKit projects.</p>
          </a>

          <a className={styles.card} href="https://nextjs.org/docs">
            <h2>Next.js Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a
            className={styles.card}
            href="https://github.com/vercel/next.js/tree/canary/examples"
          >
            <h2>Next.js Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            className={styles.card}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;
