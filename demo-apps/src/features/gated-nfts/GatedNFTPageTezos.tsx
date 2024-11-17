import { Inter } from "next/font/google";
import styles from "../kyc-widget/client.module.css";
import { GatedNFTTezos } from "./components/GatedNFTTezos";
import { KYCClientTezos } from "../multi-chain-support/components/tezos/KYCClientTezos";

const inter = Inter({ subsets: ["latin"] });

export const GatedNFTPageTezos = () => {
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientTezos />
      <GatedNFTTezos />
    </main>
  );
};
