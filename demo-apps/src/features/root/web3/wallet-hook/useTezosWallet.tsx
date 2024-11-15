import { NetworkType } from "@airgap/beacon-types";
import { useQuery } from "@tanstack/react-query";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { RpcClient } from "@taquito/rpc";
import { TezosToolkit } from "@taquito/taquito";

const RPC_ENDPOINT = "https://rpc.ghostnet.teztnets.com/";

let walletCache:
  | {
      wallet: BeaconWallet;
      rpc: RpcClient;
      tezos: TezosToolkit;
    }
  | undefined = undefined;

export const getWallet = async () => {
  if (!walletCache) {
    const tezos = new TezosToolkit(RPC_ENDPOINT);
    // creates a wallet instance
    const wallet = new BeaconWallet({
      name: "ComPilot Tezos Example",
      preferredNetwork: NetworkType.GHOSTNET,
      network: {
        type: NetworkType.GHOSTNET,
      },
    });
    // The Beacon wallet requires an extra step to set up the network to connect to and the permissions:
    await wallet.requestPermissions({
      network: {
        type: NetworkType.GHOSTNET,
      },
    });
    tezos.setWalletProvider(wallet);
    const rpc = new RpcClient(RPC_ENDPOINT);
    walletCache = { wallet, rpc, tezos };
  }
  const activeAccount = await walletCache.wallet.client.getActiveAccount();
  return { ...walletCache, address: activeAccount?.address };
};

export const useTezosWallet = () => {
  const { data, refetch } = useQuery({
    queryKey: ["tezosWallet"],
    queryFn: getWallet,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: false,
  });
  return {
    wallet: data?.wallet,
    tezos: data?.tezos,
    address: data?.address,
    connectTezos: refetch,
  };
};
