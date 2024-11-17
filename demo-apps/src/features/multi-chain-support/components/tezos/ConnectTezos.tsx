import { Button } from "@/features/bank/Components/Button";
import { useTezosWallet } from "../../../root/web3/wallet-hook/useTezosWallet";

const ConnectTezos = () => {
  const { wallet, connectTezos } = useTezosWallet();
  return (
    <div>
      {wallet === undefined ? (
        <Button
          onClick={() => {
            void connectTezos();
          }}
          className="m-2"
        >
          Connect to Tezos Wallet
        </Button>
      ) : (
        <div>connected to tezos wallet</div>
      )}
    </div>
  );
};

export default ConnectTezos;
