import { useOpenWidget } from "@compilot/react-sdk";
import Head from 'next/head';

export default function Home() {
  const openWidget = useOpenWidget();

  return (
    <>
      <Head>
        <title>Secure Identity Verification</title>
      </Head>

      <main className="container-center">
        <div className="text-center">
          <h1 className="mb-12">
            Secure Identity Verification
          </h1>
          <button
            onClick={() => openWidget.openWidget()}
            disabled={openWidget.isPending}
            className="btn-primary"
          >
            {openWidget.isPending ? "Processing..." : "Start Verification"}
          </button>
        </div>
      </main>
    </>
  );
}
