import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import ConnectPolkadot from "./ConnectPolkadot";
import { usePolkadotWallet } from "../../../root/web3/wallet-hook/usePolkadotWallet";

const AGUNG_WS_URL = "wss://wsspc1-qa.agung.peaq.network";

export const KYCClientAgung = () => {
  const { wallet } = usePolkadotWallet(AGUNG_WS_URL);
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          ComPilot Kyc Demo: Agung Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectPolkadot wsUrl={AGUNG_WS_URL} />
        {wallet && <IdentityFlow />}
      </div>
    </>
  );
};
