import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IdentityFlow } from "./IdentityFlow";

export const KYCClientEIP155 = () => {
  const { address } = useAccount();

  return (
    <>
      <ConnectButton label="Connect your wallet" />
      {address && <IdentityFlow />}
    </>
  );
};
