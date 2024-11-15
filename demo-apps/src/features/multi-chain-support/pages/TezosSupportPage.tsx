import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientTezos } from "../components/tezos/KYCClientTezos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComPilotProvider } from "@compilot/react-sdk";
import { compilotTezosConfig } from "@/features/root/web3/sdk-config/compilotTezosConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const TezosSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ComPilotProvider config={compilotTezosConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientTezos />
        </main>
      </ComPilotProvider>
    </QueryClientProvider>
  );
};
