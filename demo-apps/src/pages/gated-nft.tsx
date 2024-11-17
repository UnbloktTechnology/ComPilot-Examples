import { GatedNFTPage } from "@/features/gated-nfts/GatedNFTPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ComPilotProvider } from "@compilot/react-sdk";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { wagmiConfig } from "@/features/root/web3/wagmiConfig";
import { createDemoWeb3WagmiSdkConfig } from "@/features/root/identity/createDemoWeb3WagmiSdkConfig";

const queryClient = new QueryClient();
const compilotConfig = createDemoWeb3WagmiSdkConfig("kyc");

const Home = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ComPilotProvider config={compilotConfig}>
            <GatedNFTPage />
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer />
          </ComPilotProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Home;
