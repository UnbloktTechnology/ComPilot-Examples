import { Button } from "@/features/bank/Components/Button";
import Link from "next/link";

const MultiChainPage = () => {
  return (
    <div className="flex h-screen flex-col items-center gap-5 bg-gray-100 pt-20">
      <p className="text-primary-900 text-2xl font-bold">
        Multi Chain Integration
      </p>
      <div className="flex items-center justify-center gap-5">
        <div>
          <Link href="/multi-chain-support/tezos-example">
            <Button>Tezos</Button>
          </Link>
        </div>
        <div>
          <Link href="/multi-chain-support/aptos-example">
            <Button>Aptos</Button>
          </Link>
        </div>
        <div>
          <Link href="/multi-chain-support/polkadot-example">
            <Button>Polkadot</Button>
          </Link>
        </div>
        <div>
          <Link href="/multi-chain-support/agung-example">
            <Button>Agung (Peaq Testnet)</Button>
          </Link>
        </div>
        <div>
          <Link href="/multi-chain-support/cosmos-example">
            <Button>Cosmos</Button>
          </Link>
        </div>
        <div>
          <Link href="/multi-chain-support/starknet-example">
            <Button>Starknet</Button>
          </Link>
        </div>
        <div>
          <Link href="/multi-chain-support/solana-example">
            <Button>Solana</Button>
          </Link>
        </div>
        <div>
          <Link href="/multi-chain-support/cardano-example">
            <Button>Cardano</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MultiChainPage;
