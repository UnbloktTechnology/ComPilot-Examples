import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientCosmos } from "../components/cosmos/KYCClientCosmos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComPilotProvider } from "@compilot/react-sdk";
import { compilotCosmosConfig } from "@/features/root/web3/sdk-config/compilotCosmosConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const CosmosSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ComPilotProvider config={compilotCosmosConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientCosmos />
        </main>
      </ComPilotProvider>
    </QueryClientProvider>
  );
};
