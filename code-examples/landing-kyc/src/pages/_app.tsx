import type { AppProps } from 'next/app';
import { ComPilotProvider } from "@compilot/react-sdk";
import { createAuthAdapter, createConfig } from "@compilot/react-sdk";
import { createSession } from "../utils/session";
import '../index.css';

const authAdapter = createAuthAdapter({ 
  createSession: () => createSession() 
});
const compilotConfig = createConfig({ authAdapter });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ComPilotProvider config={compilotConfig}>
      <Component {...pageProps} />
    </ComPilotProvider>
  );
}  