import { Button } from "@/features/bank/Components/Button";
import { useAptosWallet } from "../../../root/web3/wallet-hook/useAptosWallet";

const ConnectAptos = () => {
  const { wallet, connectAptos } = useAptosWallet();
  return (
    <div>
      {wallet === undefined ? (
        <Button
          onClick={() => {
            void connectAptos();
          }}
          className="m-2"
        >
          Connect to Aptos Wallet
        </Button>
      ) : (
        <div>connected to aptos wallet</div>
      )}
    </div>
  );
};

export default ConnectAptos;
