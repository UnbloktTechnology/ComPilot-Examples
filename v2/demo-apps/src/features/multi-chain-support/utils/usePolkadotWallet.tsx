import { ApiPromise, WsProvider } from "@polkadot/api";
import type { InjectedExtension } from "@polkadot/extension-inject/types";
import { useQuery } from "@tanstack/react-query";

import { PolkadotAddress, PolkadotSignature } from "@nexeraid/identity-schemas";

export const signWithPolkadot = async (
  message: string,
  accountAddress: PolkadotAddress,
  injector: InjectedExtension | undefined,
) => {
  if (!injector) {
    throw new Error("signWithPolkadot called before wallet was injected");
  }

  // Use the injector to sign the message
  const signature =
    injector.signer.signRaw &&
    (await injector.signer.signRaw({
      address: accountAddress,
      data: message,
      type: "payload",
    }));

  console.log(`Signature: ${signature?.signature}`);
  return PolkadotSignature.parse(signature?.signature);
};

export const getWallet = async (wsUrl = "wss://rpc.polkadot.io") => {
  const { web3Accounts, web3Enable, web3FromAddress } = await import(
    "@polkadot/extension-dapp"
  );

  // Connect to a Polkadot node
  const provider = new WsProvider(wsUrl);
  await ApiPromise.create({ provider });
  // Enable extension (this pops up the extension and asks the user to give access to your website)
  const extensions = await web3Enable("NexeraID Widget");
  if (extensions.length === 0) {
    throw new Error("No extension found. Please install Talisman extension.");
  }

  // Get all the accounts from the extension
  const allAccounts = await web3Accounts();
  if (allAccounts.length === 0) {
    throw new Error(
      "No accounts found. Make sure Talisman is set up and accounts are created.",
    );
  }

  // Select the first account (you could provide a UI to let the user select an account)
  const account = allAccounts[0];
  console.log(`Using account ${account?.address}`);

  // Get the injector for the selected account
  const injector = account && (await web3FromAddress(account.address));

  return { injector, address: PolkadotAddress.parse(account?.address) };
};

export const usePolkadotWallet = (wsUrl?: string) => {
  const { data, refetch } = useQuery({
    queryKey: ["PolkadotWallet"],
    queryFn: async () => {
      return getWallet(wsUrl);
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: false,
  });
  return { wallet: data, connectPolkadot: refetch, address: data?.address };
};
