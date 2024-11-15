import { Button } from "@/features/bank/Components/Button";
import { useCardanoWallet } from "../../../root/web3/wallet-hook/useCardanoWallet";

const ConnectCardano = () => {
  const { wallet, connectCardano } = useCardanoWallet();
  return (
    <div>
      {wallet === undefined ? (
        <Button
          onClick={() => {
            void connectCardano();
          }}
          className="m-2"
        >
          Connect to Cardano Wallet
        </Button>
      ) : (
        <div>connected to cardano wallet</div>
      )}
    </div>
  );
};

export default ConnectCardano;
