import React, { useEffect, useState } from "react";
import { DisclaimerOverlay } from "@/features/bank/Components/DisclaimerOverlay";
import { Dashboard } from "@/features/bank/Dashboard";

import { Banner, Content, Header, Layout } from "@/features/bank/Layout";
import { useGlobalModals } from "@/features/bank/Modals/useGlobalModals";
import { IDENTITY_CLIENT } from "@/features/bank/identity/IdentityClient";
import { getSigner } from "@/appConfig";
import { toast } from "react-toastify";
import { useBankKycAuthentication } from "@/features/bank/identity/useBankKycAuthenticate";
import { useCheckBankCompliance } from "@/features/bank/identity/useCheckBankCompliance";

const Home = () => {
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
    data: state.data,
  }));
  const { user, accessToken, signingMessage, signature } =
    useBankKycAuthentication();
  const [kycCompletion, setKycCompletion] = useState(false);
  const { data } = useCheckBankCompliance(kycCompletion);
  const [isCompliance, setIsCompliance] = useState(false);

  useEffect(() => {
    console.log("EXECUTING isVerified check compliance: ", data);
    if (data !== undefined) {
      if (data.isValid) {
        toast(`Your identity has been verified`);
        setKycCompletion(false);
        setIsCompliance(true);
      } else if (data.data === "not_received") {
        setKycCompletion(true);
      } else {
        toast(`Your identity has not been verified`);
        setKycCompletion(false);
        setIsCompliance(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isCompliance) {
      close();
    }
  }, [isCompliance]);

  useEffect(() => {
    if (user && accessToken && signingMessage && signature) {
      console.log(
        "Ready to init: ",
        user,
        accessToken,
        signingMessage,
        signature,
      );
      IDENTITY_CLIENT.onSignMessage(async (data) => {
        console.log("on sign personal data");
        const signer = getSigner(user);
        return await signer.signMessage(data.message);
      });
      IDENTITY_CLIENT.onKycCompletion((data) => {
        void (() => {
          console.log("on kyc completion", data);
          setKycCompletion(true);
        })();
      });
      // TODO: properly wait for init resolve
      void IDENTITY_CLIENT.init({
        accessToken,
        signingMessage,
        signature,
      });
    }
  }, [user]);

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
      header={!isCompliance ? <Header onClickLogOn={onClickLogOn} /> : <></>}
      className={!isCompliance ? "px-[105px]" : "bg-[#F2F2F2]"}
    >
      {!isCompliance ? (
        <>
          <Banner />
          <Content />
        </>
      ) : (
        <Dashboard />
      )}
      <DisclaimerOverlay
        content="This web application  is a simulated, mockup banking application developed solely for the purpose of demonstrating the functionalities and capabilities of the NexeraID product. It is not affiliated with, endorsed by, or in any way associated with any real-world banking or financial institution."
        textButton="I understood"
        className="bg-[#3E505D]"
        classNameButton="border-none !rounded-none !bg-[#DB0011] font-normal"
      />
    </Layout>
  );
};

export default Home;