import { GatedNFTPageTezos } from "@/features/gated-nfts/GatedNFTPageTezos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createConfig,
  createWeb3AuthAdapter,
  ComPilotProvider,
} from "@compilot/react-sdk";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { tezosWalletConfig } from "@/features/root/web3/sdk-wallet/tezosWallet";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";

const queryClient = new QueryClient();

const compilotConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: tezosWalletConfig,
    generateChallenge: createDemoAppGenerateChallengeCallback("kyc"),
  }),
});

const Home = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ComPilotProvider config={compilotConfig}>
        <GatedNFTPageTezos />
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer />
      </ComPilotProvider>
    </QueryClientProvider>
  );
};

export default Home;
