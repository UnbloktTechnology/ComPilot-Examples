import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientStarknet } from "../components/starknet/KYCClientStarknet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComPilotProvider } from "@compilot/react-sdk";
import { compilotStarknetConfig } from "@/features/root/web3/sdk-config/compilotStarknetConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const StarknetSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ComPilotProvider config={compilotStarknetConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientStarknet />
        </main>
      </ComPilotProvider>
    </QueryClientProvider>
  );
};
