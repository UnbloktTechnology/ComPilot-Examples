import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import ConnectPolkadot from "./ConnectPolkadot";
import { usePolkadotWallet } from "../../../root/web3/wallet-hook/usePolkadotWallet";

export const KYCClientPolkadot = () => {
  const { wallet } = usePolkadotWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          ComPilot Kyc Demo: Polkadot Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectPolkadot />
        {wallet && <IdentityFlow />}
      </div>
    </>
  );
};
