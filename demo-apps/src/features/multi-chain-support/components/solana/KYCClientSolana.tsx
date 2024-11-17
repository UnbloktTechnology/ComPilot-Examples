import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import { useWallet } from "@solana/wallet-adapter-react";

export const KYCClientSolana = () => {
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58();

  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          ComPilot Kyc Demo: Solana Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        {address && <IdentityFlow />}
      </div>
    </>
  );
};
