import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import ConnectCosmos from "./ConnectCosmos";
import { useCosmosWallet } from "../../../root/web3/wallet-hook/useCosmosWallet";

export const KYCClientCosmos = () => {
  const { wallet } = useCosmosWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          ComPilot Kyc Demo: Cosmos Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectCosmos />
        {wallet && <IdentityFlow />}
      </div>
    </>
  );
};
