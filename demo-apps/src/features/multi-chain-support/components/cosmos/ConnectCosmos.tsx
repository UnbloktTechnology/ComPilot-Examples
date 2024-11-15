import { Button } from "@/features/bank/Components/Button";
import { useCosmosWallet } from "../../../root/web3/wallet-hook/useCosmosWallet";

const ConnectCosmos = () => {
  const { wallet, connectCosmos } = useCosmosWallet();
  return (
    <div>
      {wallet === undefined ? (
        <Button
          onClick={() => {
            void connectCosmos();
          }}
          className="m-2"
        >
          Connect to Cosmos Wallet
        </Button>
      ) : (
        <div>connected to cosmos wallet</div>
      )}
    </div>
  );
};

export default ConnectCosmos;
