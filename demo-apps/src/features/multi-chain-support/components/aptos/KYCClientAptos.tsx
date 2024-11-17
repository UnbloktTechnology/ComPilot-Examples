import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import ConnectAptos from "./ConnectAptos";
import { useAptosWallet } from "../../../root/web3/wallet-hook/useAptosWallet";

export const KYCClientAptos = () => {
  const { wallet } = useAptosWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          ComPilot Kyc Demo: Aptos Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectAptos />
        {wallet && <IdentityFlow />}
      </div>
    </>
  );
};
