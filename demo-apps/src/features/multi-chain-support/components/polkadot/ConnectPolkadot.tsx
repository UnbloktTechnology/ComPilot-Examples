import { Button } from "@/features/bank/Components/Button";
import { usePolkadotWallet } from "../../../root/web3/wallet-hook/usePolkadotWallet";

const ConnectPolkadot = (props: { wsUrl?: string }) => {
  const { wallet, connectPolkadot } = usePolkadotWallet(props.wsUrl);
  return (
    <div>
      {wallet === undefined ? (
        <Button
          onClick={() => {
            void connectPolkadot();
          }}
          className="m-2"
        >
          Connect to Polkadot Wallet
        </Button>
      ) : (
        <div>Connected to Polkadot Wallet</div>
      )}
    </div>
  );
};

export default ConnectPolkadot;
