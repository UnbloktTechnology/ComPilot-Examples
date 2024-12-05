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
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                    <div className="mx-auto w-[1200px] flex gap-8">
                        {/* Left Column - Title and Button */}
                        <div className="w-[300px] flex flex-col items-center pt-6">
                            <h1 className="text-[24px] font-bold leading-[32px] text-black">
                                {companyName} Business Verification
                            </h1>

                            <button
                                type="button"
                                className="mt-8 h-14 w-full rounded-2xl border-2 border-[#E6D5F7] 
                                         bg-white text-center text-xl text-black 
                                         hover:bg-[#E6D5F7] transition-all duration-300"
                                onClick={() => {
                                    void handleClick();
                                }}
                            >
                                Start Verification
                            </button>
                        </div>

                        {/* Right Column - Documentation Requirements */}
                        <div className="flex-1 text-left bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4 text-blue-900">Required Documentation for KYB</h3>

                            <div className="bg-blue-50 p-4 rounded-md mb-6">
                                <p className="text-blue-800 font-medium">
                                    Please make sure to provide documentation for:
                                </p>
                                <ul className="list-disc ml-5 mt-2 text-blue-800">
                                    <li>Company Registration</li>
                                    <li>Official Address</li>
                                    <li>Ownership Structure</li>
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-blue-800 mb-2">
                                        1. Company Registration (Any one): We want to check that the company is properly registered and its address.
                                    </h4>
                                    <ul className="list-disc ml-5 space-y-1">
                                        <li>Certificate of incorporation</li>
                                        <li>State company registry excerpt</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-blue-800 mb-2">
                                        2. Ownership Proof (Any one): We are going to check the company structure, so make sure that UBO's names appear on the documents you provide.
                                    </h4>
                                    <ul className="list-disc ml-5 space-y-1">
                                        <li>Articles of incorporation</li>
                                        <li>Memorandum of association</li>
                                        <li>UBO (Ultimate Beneficial Ownership) registry excerpt</li>
                                        <li>Certificate of incumbency</li>
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-md">
                                    <h4 className="font-semibold text-yellow-800">Important Notes:</h4>
                                    <ul className="list-disc ml-5 space-y-1 text-yellow-800">
                                        <li>All ownership documents must be less than 12 months old</li>
                                        <li>We do not accept invoices, receipts, or document screenshots</li>
                                        <li>All individuals, UBOs with more than 25% ownership, and directors are expected to complete KYC, which includes uploading their ID and a liveliness check (selfie).</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;