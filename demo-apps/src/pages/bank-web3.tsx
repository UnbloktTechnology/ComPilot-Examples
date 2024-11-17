import { useEffect } from "react";
import { Dashboard } from "@/features/bank-web3/Dashboard";
import { Content, Header, Layout } from "@/features/bank-web3/Layout";
import { useGlobalModals } from "@/features/bank-web3/Modals/useGlobalModals";
import { ToastContainer } from "react-toastify";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComPilotProvider, useCustomerStatus } from "@compilot/react-sdk";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createDemoWeb3WagmiSdkConfig } from "@/features/root/identity/createDemoWeb3WagmiSdkConfig";
import { wagmiConfig } from "@/features/root/web3/wagmiConfig";

const queryClient = new QueryClient();
const compilotConfig = createDemoWeb3WagmiSdkConfig("bank-web3");

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
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
    data: state.data,
  }));
  const customerStatus = useCustomerStatus();
  const isCompliant = customerStatus.data === "Active";
  useEffect(() => {
    if (isCompliant) {
      close();
    }
  }, [isCompliant, close]);

  const onClickLogOn = () => {
    openModal(
      "LogOnModal",
      {
        modalType: "center",
        overlayType: "dark",
      },
      {
        basicData: {
          text: "",
          icon: "help",
          textButton: "Verify Identity",
        },
      },
    );
  };

  return (
    <Layout
      header={!isCompliant ? <Header onClickLogOn={onClickLogOn} /> : <></>}
      className={!isCompliant ? "px-[105px]" : "bg-[#F2F2F2]"}
    >
      {!isCompliant ? <Content onClickLogOn={onClickLogOn} /> : <Dashboard />}
    </Layout>
  );
};

export default Home;
