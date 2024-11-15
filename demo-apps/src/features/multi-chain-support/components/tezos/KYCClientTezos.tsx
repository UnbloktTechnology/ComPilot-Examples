import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import ConnectTezos from "./ConnectTezos";
import { useTezosWallet } from "../../../root/web3/wallet-hook/useTezosWallet";

export const KYCClientTezos = () => {
  const { wallet } = useTezosWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          ComPilot Kyc Demo: Tezos Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectTezos />
        {wallet && <IdentityFlow />}
      </div>
    </>
  );
};
