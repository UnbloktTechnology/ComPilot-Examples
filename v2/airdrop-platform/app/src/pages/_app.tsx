import type { AppType } from "next/app";
import "@/ui/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { WagmiProvider } from "wagmi";
import { compilotConfig } from "@/compilotConfig";
import { wagmiConfig } from "@/wagmiConfig";
import { ComPilotProvider } from "@compilot/react-sdk";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { queryClient } from "@/reactQueryConfig";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ComPilotProvider config={compilotConfig}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer />
          </ComPilotProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
