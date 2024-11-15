import React, { useEffect } from "react";
import { DisclaimerOverlay } from "@/features/bank-kyb/Components/DisclaimerOverlay";
import { Dashboard } from "@/features/bank-kyb/Dashboard";
import { Banner, Content, Header, Layout } from "@/features/bank-kyb/Layout";
import { useGlobalModals } from "@/features/bank-kyb/Modals/useGlobalModals";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComPilotProvider, useCustomerStatus } from "@compilot/react-sdk";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { compilotConfig } from "@/features/bank-kyb/identity/compilotConfig";

const queryClient = new QueryClient();

const Home = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ComPilotProvider config={compilotConfig}>
        <HomeContent />
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer />
      </ComPilotProvider>
    </QueryClientProvider>
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
      {!isCompliant ? (
        <>
          <Banner />
          <Content />
        </>
      ) : (
        <Dashboard />
      )}
      <DisclaimerOverlay
        content="This web application  is a simulated, mockup bank-kybing application developed solely for the purpose of demonstrating the functionalities and capabilities of the ComPilot product. It is not affiliated with, endorsed by, or in any way associated with any real-world bank-kybing or financial institution."
        textButton="I understood"
        className="bg-[#3E505D]"
        classNameButton="border-none !rounded-none !bg-[#77B212] font-normal"
      />
    </Layout>
  );
};

export default Home;
