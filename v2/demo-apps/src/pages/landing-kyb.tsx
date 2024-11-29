import { WagmiProvider } from 'wagmi';
import { Layout } from "@/features/landing-kyb/Layout/Layout";
import { wagmiConfig } from "@/features/root/web3/wagmiConfig";
import {
    generatePrivateKey,
    privateKeyToAccount,
    signMessage,
} from "viem/accounts";
import { generateChallengeKYB } from "@/features/landing-kyb/identity/compilotConfig";
import { ComPilotProvider, useOpenWidget, useDisconnect, createWeb3AuthAdapter, createConfig } from "@compilot/react-sdk";
import type { Web3Wallet } from "@compilot/react-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

const getWallet = async () => ({
    userAddress: account.address,
    privateKey
});

const customSignMessage = async (message: string) => {
    const signature = await signMessage({ message, privateKey });
    return {
        signature,
        publicKey: account.address
    };
};

const preProcess = (message: string) => message;

const customWalletConfig: Web3Wallet = {
    namespace: "eip155" as const,

    getAddress: async () => {
        const { userAddress } = await getWallet();
        return userAddress;
    },

    sign: async ({ message }) => {
        const signedMessage = preProcess(message);
        const { signature, publicKey } = await customSignMessage(signedMessage);

        return {
            message,
            signature,
            signerPublicKey: publicKey,
            signedMessage
        };
    },

    isConnected: async () => {
        const wallet = await getWallet();
        return Boolean(wallet);
    }
};

const authAdapter = createWeb3AuthAdapter({
    wallet: customWalletConfig,
    generateChallenge: generateChallengeKYB
});

export const compilotConfig = createConfig({ authAdapter });

const queryClient = new QueryClient();

const Home = () => {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <ComPilotProvider config={compilotConfig}>
                    <HomeContent />
                </ComPilotProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

const HomeContent = () => {
    const openWidget = useOpenWidget();
    const { disconnect } = useDisconnect();
    const companyName = process.env.NEXT_PUBLIC_LANDING_KYB_COMPANY ?? '';

    const handleClick = async () => {
        try {
            await disconnect();
            await new Promise(resolve => setTimeout(resolve, 100));
            await openWidget.openWidget();
        } catch (error) {
            await disconnect();
        }
    };

    return (
        <Layout>
            <div className="absolute top-0 z-20 h-screen w-screen bg-white">
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
                    <div className="mx-auto flex w-[800px] flex-col gap-4 text-center">
                        <h1 className="text-[64px] font-bold leading-[72px] text-black">
                            {companyName} Business Verification
                        </h1>

                        <div className="text-gray-600">
                            <h2 className="text-2xl font-semibold mb-4">
                                Complete Your KYB Process
                            </h2>
                            <div className="flex flex-col gap-2">
                                <h6>Verify your company&apos;s identity and structure</h6>
                                <h6>Submit required business documentation</h6>
                                <h6>Confirm beneficial ownership information</h6>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="mx-auto mt-11 h-14 w-80 rounded-2xl border-2 border-[#E6D5F7] 
                                     bg-white text-center text-xl text-black 
                                     hover:bg-[#E6D5F7] transition-all duration-300"
                            onClick={() => {
                                void handleClick();
                            }}
                        >
                            Start Verification
                        </button>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default Home;