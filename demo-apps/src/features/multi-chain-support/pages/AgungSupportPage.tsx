import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientAgung } from "../components/polkadot/KYCClientAgung";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComPilotProvider } from "@compilot/react-sdk";
import { compilotAgungConfig } from "@/features/root/web3/sdk-config/compilotAgungConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const AgungSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ComPilotProvider config={compilotAgungConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientAgung />
        </main>
      </ComPilotProvider>
    </QueryClientProvider>
  );
};
