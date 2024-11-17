import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientCardano } from "../components/cardano/KYCClientCardano";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComPilotProvider } from "@compilot/react-sdk";
import { compilotCardanoConfig } from "@/features/root/web3/sdk-config/compilotCardanoConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const CardanoSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ComPilotProvider config={compilotCardanoConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientCardano />
        </main>
      </ComPilotProvider>
    </QueryClientProvider>
  );
};
