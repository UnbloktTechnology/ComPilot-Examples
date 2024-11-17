import { Inter } from "next/font/google";
import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import styles from "../../kyc-widget/client.module.css";
import { SolanaExample } from "../components/solana/SolanaExample";
import {
  createConfig,
  createWeb3AuthAdapter,
  ComPilotProvider,
  Web3SignatureRejected,
  type Web3Wallet,
} from "@compilot/react-sdk";
import { toBytes, toHex } from "viem";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";

// Default styles that can be overridden by your app
import "@/features/root/configureReactDemoEnv";
require("@solana/wallet-adapter-react-ui/styles.css");

const inter = Inter({ subsets: ["latin"] });

export const IdentitySdkWeb3SolanaProvider = ({
  children,
}: React.PropsWithChildren) => {
  const { publicKey, signMessage, connected } = useWallet();
  console.log("publicKey", publicKey);

  const identitySdk = useMemo(() => {
    const solanaWallet: Web3Wallet = {
      namespace: "solana",
      isConnected: () => connected,
      getAddress: () => {
        if (!publicKey) {
          throw new Error("No public key");
        }
        return publicKey.toBase58();
      },
      sign: async ({ message }) => {
        if (!publicKey) {
          throw new Error("No public key");
        }
        const signature = signMessage && (await signMessage(toBytes(message)));
        if (!signature) {
          throw new Web3SignatureRejected("Signature rejected");
        }

        const signatureHex = toHex(signature);
        const publicKeyHex = toHex(publicKey.toBytes());

        return {
          message,
          signature: signatureHex,
          signerPublicKey: publicKeyHex,
          signedMessage: message,
        };
      },
    };

    return createConfig({
      authAdapter: createWeb3AuthAdapter({
        wallet: solanaWallet,
        generateChallenge: createDemoAppGenerateChallengeCallback(
          "multi-chain-support",
        ),
      }),
    });
  }, [connected, publicKey, signMessage]);

  if (!identitySdk) {
    return <>Loading...</>;
  }

  return <ComPilotProvider config={identitySdk}>{children}</ComPilotProvider>;
};

const SolanaProviders = ({ children }: { children: React.ReactNode }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const IdentityWidgetContentSolana = () => {
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58();
  if (!address) {
    return (
      <main className={`${inter.className} ${styles.main}`}>
        <WalletMultiButton />
        <WalletDisconnectButton />
      </main>
    );
  }
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <>
        <div>connected to solana wallet</div>
        <SolanaExample />
      </>
    </main>
  );
};

export const SolanaSupportPage = () => (
  <SolanaProviders>
    <IdentitySdkWeb3SolanaProvider>
      <IdentityWidgetContentSolana />
    </IdentitySdkWeb3SolanaProvider>
  </SolanaProviders>
);
