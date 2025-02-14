import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ComPilotProvider } from "@compilot/react-sdk";
import { 
  compilotConfigWalletKYC, 
  compilotConfigWalletKYB,
  compilotConfigRegularKYC,
  compilotConfigRegularKYB 
} from "./_app";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import ComPilotButton from "../components/ComPilotButton";

type UserType = "individual" | "company" | null;
type WalletStatus = "has-wallet" | "no-wallet" | null;

const Home: NextPage<{ setActiveConfig: (config: any) => void }> = ({ setActiveConfig }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>(null);
  const { isConnected } = useAccount();

  const renderQuestions = () => (
    <div className={styles.questionnaire}>
      <div className={styles.questionGroup}>
        <h3>Are you an individual or a company?</h3>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="userType"
              value="individual"
              checked={userType === "individual"}
              onChange={(e) => setUserType(e.target.value as UserType)}
            />
            Individual
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="company"
              checked={userType === "company"}
              onChange={(e) => setUserType(e.target.value as UserType)}
            />
            Company
          </label>
        </div>
      </div>

      <div className={`${styles.questionGroup} ${!userType ? styles.hidden : ''}`}>
        <h3>Do you have a Web3 wallet?</h3>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="walletStatus"
              value="has-wallet"
              checked={walletStatus === "has-wallet"}
              onChange={(e) => setWalletStatus(e.target.value as WalletStatus)}
            />
            I have a wallet
          </label>
          <label>
            <input
              type="radio"
              name="walletStatus"
              value="no-wallet"
              checked={walletStatus === "no-wallet"}
              onChange={(e) => setWalletStatus(e.target.value as WalletStatus)}
            />
            I don&#39;t have a wallet
          </label>
        </div>
      </div>
    </div>
  );

  const renderAction = () => {
    if (!userType || !walletStatus) return null;

    if (walletStatus === "has-wallet" && !isConnected) {
      return (
        <div className={styles.actionSection}>
          <p>Please connect your wallet first:</p>
          <ConnectButton />
        </div>
      );
    }

    const config = walletStatus === "has-wallet"
      ? (userType === "individual" ? compilotConfigWalletKYC : compilotConfigWalletKYB)
      : (userType === "individual" ? compilotConfigRegularKYC : compilotConfigRegularKYB);
    const buttonType = userType === "individual" ? "KYC" : "KYB";

    return (
      <div className={styles.actionSection}>
        <ComPilotProvider config={config}>
          <ComPilotButton 
            config={buttonType} 
            hasWallet={walletStatus === "has-wallet"} 
            setActiveConfig={setActiveConfig}
          />
        </ComPilotProvider>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <header className="header">
        <Image
          src="/images/psalion.png"
          alt="Psalion Logo"
          width={120}
          height={40}
          className="logo"
          priority
        />
      </header>
      <Head>
        <title>Psalion Landing Page</title>
        <meta content="ComPilot Example" name="description" />
      </Head>

      <main className={styles.main}>
        {renderQuestions()}
        {renderAction()}
      </main>
    </div>
  );
};

export default Home; 