import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useOpenWidget } from "@compilot/react-sdk";
import { useAccount } from 'wagmi';
import { useCustomerCheck } from '../hooks/useCustomerCheck';
import { useSignatureGating } from '../hooks/useSignatureGating';

const Home: NextPage = () => {
  const openWidget = useOpenWidget();
  const { isConnected, address } = useAccount();
  const { status, loading: statusLoading } = useCustomerCheck();
  const { requestSignature, loading: signatureLoading, error } = useSignatureGating();

  const handleClaimToken = async () => {
    const signatureResponse = await requestSignature();
    if (signatureResponse?.isAuthorized) {
      console.log('Signature authorized:', signatureResponse.payload);
      // TODO: Will use this signature with smart contract later
    } else {
      console.error('Signature not authorized');
    }
  };

  const needsKYC = status !== 'Active';
  const isLoading = statusLoading || signatureLoading;

  return (
    <div className={styles.container}>
      <Head>
        <title>ComPilot Next.Js Web3</title>
        <meta content="ComPilot Example" name="description" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        {isConnected && !isLoading && (
          <>
            {needsKYC ? (
              <button
                id="compilot-button"
                disabled={openWidget.isPending}
                onClick={() => openWidget.openWidget()}
                className={styles.claimButton}
              >
                Complete KYC
              </button>
            ) : (
              <button
                onClick={handleClaimToken}
                className={styles.claimButton}
                disabled={isLoading}
              >
                {signatureLoading ? 'Requesting Signature...' : 'Claim Token'}
              </button>
            )}
          </>
        )}

        {error && (
          <p className={styles.error}>{error}</p>
        )}
      </main>
    </div>
  );
};

export default Home;
