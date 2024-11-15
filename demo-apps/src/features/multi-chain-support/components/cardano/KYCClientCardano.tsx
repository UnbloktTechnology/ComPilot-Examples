import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import ConnectCardano from "./ConnectCardano";
import { useCardanoWallet } from "../../../root/web3/wallet-hook/useCardanoWallet";

export const KYCClientCardano = () => {
  const { wallet } = useCardanoWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          ComPilot Kyc Demo: Cardano Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectCardano />
        {wallet && <IdentityFlow />}
      </div>
    </>
  );
};
