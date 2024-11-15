import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import ConnectStarknet from "./ConnectStarknet";
import { useStarknetWallet } from "../../../root/web3/wallet-hook/useStarknetWallet";

export const KYCClientStarknet = () => {
  const { wallet } = useStarknetWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          ComPilot Kyc Demo: Starknet Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectStarknet />
        {wallet && <IdentityFlow />}
      </div>
    </>
  );
};
