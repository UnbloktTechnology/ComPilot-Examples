import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientPolkadot } from "../components/polkadot/KYCClientPolkadot";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComPilotProvider } from "@compilot/react-sdk";
import { compilotPolkadotConfig } from "@/features/root/web3/sdk-config/compilotPolkadotConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const PolkadotSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ComPilotProvider config={compilotPolkadotConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientPolkadot />
        </main>
      </ComPilotProvider>
    </QueryClientProvider>
  );
};
