import { Swap } from "@/features/defi-rule-engine/Components/Swap";
import { Header } from "@/features/defi-rule-engine/Layout/Header";
import { Layout } from "@/features/defi-rule-engine/Layout/Layout";
import { useGlobalModals } from "@/features/defi-rule-engine/Modals/Hooks/useGlobalModals";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComPilotProvider, useCustomerStatus } from "@compilot/react-sdk";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/features/root/web3/wagmiConfig";
import { createDemoWeb3WagmiSdkConfig } from "@/features/root/identity/createDemoWeb3WagmiSdkConfig";

const queryClient = new QueryClient();
const compilotConfig = createDemoWeb3WagmiSdkConfig("defi-rule-engine");

const Home = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ComPilotProvider config={compilotConfig}>
            <HomeContent />
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer />
          </ComPilotProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const HomeContent = () => {
  const close = useGlobalModals((state) => state.close);
  const [started, setStarted] = useState(false);

  const customerStatus = useCustomerStatus();
  const isCompliant = customerStatus.data === "Active";
  useEffect(() => {
    if (isCompliant) {
      close();
    }
  }, [isCompliant, close]);

  return (
    <Layout header={<Header />} bg={"defi"}>
      <>
        <Swap />
        {!started && (
          <>
            <div className="absolute left-1/2 top-24 z-0 h-1/2 w-[480px] -translate-x-1/2 rounded-3xl bg-gradient-to-t from-[#FF5237] to-[#FFA59700]" />
            <div className="absolute top-0 z-20 h-screen w-screen bg-gradient-to-t from-[#080A18] from-50% to-transparent to-95%">
              <div className="fixed bottom-32 w-full text-center">
                <div className="mx-auto flex w-[800px] flex-col gap-4 text-center">
                  <h1 className="bg-gradient-to-t from-[#DEFFCF] to-[#FF5D57] bg-clip-text text-[64px] font-bold leading-[72px] text-transparent">
                    Welcome to the new Institutional Uniswap dApp
                  </h1>

                  <div className="text-[#98A1C0]">
                    <h6>1. Verify your identity off-chain to access the app</h6>
                  </div>
                </div>

                <button
                  type="button"
                  className="mx-auto mt-11 h-14 w-80 rounded-2xl border-none bg-gradient-to-r from-[#FF2200] to-[#FFAC9F] text-center text-xl text-white"
                  onClick={() => setStarted(true)}
                >
                  Get started
                </button>
              </div>
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

export default Home;
