import { Inter } from "next/font/google";
import styles from "../kyc-widget/client.module.css";
import { KYCClientEIP155 } from "../kyc-widget/KYCClientEIP155";
import { GatedNFT } from "./components/GatedNFT";

const inter = Inter({ subsets: ["latin"] });

export const GatedNFTPage = () => {
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientEIP155 />
      <GatedNFT />
    </main>
  );
};
