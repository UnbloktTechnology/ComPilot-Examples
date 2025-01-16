import { useCallback } from "react";
import { useRedirectToHome } from "./navigation";
import { useDisconnect as useWagmiDisconnect } from "wagmi";
import { useDisconnect as useComPilotDisconnect } from "@compilot/react-sdk";

export const useLogout = () => {
  const redirectToHome = useRedirectToHome();
  const { disconnect: disconnectWagmi } = useWagmiDisconnect();
  const { disconnect: disconnectComPilot } = useComPilotDisconnect();

  return useCallback(() => {
    disconnectWagmi();
    void disconnectComPilot();
    redirectToHome();
  }, [disconnectWagmi, redirectToHome, disconnectComPilot]);
};
