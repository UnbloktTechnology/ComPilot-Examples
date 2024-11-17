import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientAptos } from "../components/aptos/KYCClientAptos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComPilotProvider } from "@compilot/react-sdk";
import { compilotAptosConfig } from "@/features/root/web3/sdk-config/compilotAptosConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const AptosSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ComPilotProvider config={compilotAptosConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientAptos />
        </main>
      </ComPilotProvider>
    </QueryClientProvider>
  );
};
