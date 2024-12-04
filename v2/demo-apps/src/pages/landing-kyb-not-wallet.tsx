import { WagmiProvider } from "wagmi";
import { Layout } from "@/features/landing-kyb/Layout/Layout";
import { wagmiConfig } from "@/features/root/web3/wagmiConfig";
import {
  ComPilotProvider,
  useOpenWidget,
  useDisconnect,
} from "@compilot/react-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { compilotConfig } from "@/features/landing-kyb-without-wallet/identity/compilotConfig";
import { useMockKybWithoutWallet } from "@/features/landing-kyb-without-wallet/identity/useKybWithoutWalletAuthentication";

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
  const companyName = process.env.NEXT_PUBLIC_LANDING_KYB_COMPANY ?? "";
  const { authenticate, isAuthenticated, logout } = useMockKybWithoutWallet();

  const handleClick = async () => {
    try {
      await disconnect();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await openWidget.openWidget();
    } catch (error) {
      await disconnect();
    }
  };

  return (
    <Layout>
      <div className="absolute top-0 z-20 h-screen w-screen bg-white">
        <div className="fixed top-1/2 w-full">
          <div className="mx-auto flex w-[1200px] justify-center gap-8">
            {/* Left Column - Title and Button */}
            <div className="flex flex-col items-center pt-6">
              <h1 className="text-[24px] font-bold leading-[32px] text-black">
                {companyName} Verification
              </h1>

              {isAuthenticated ? (
                <div>
                  <button
                    type="button"
                    className="mt-8 h-14 w-full rounded-2xl border-2 border-[#E6D5F7] 
                                         bg-white text-center text-xl text-black 
                                         transition-all duration-300 hover:bg-[#E6D5F7]"
                    onClick={() => {
                      void handleClick();
                    }}
                  >
                    Start Verification
                  </button>

                  <button
                    type="button"
                    className="mt-8 h-14 w-full rounded-2xl border-2 border-[#E6D5F7] 
                                         bg-white text-center text-xl text-black 
                                         transition-all duration-300 hover:bg-[#E6D5F7]"
                    onClick={() => {
                      logout.mutate();
                    }}
                  >
                    Log out user
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="mt-8 h-14 w-full rounded-2xl border-2 border-[#E6D5F7] 
                                     bg-white text-center text-xl text-black 
                                     transition-all duration-300 hover:bg-[#E6D5F7]"
                  onClick={() => {
                    const randomUserId = crypto.randomUUID();
                    authenticate.mutate({ userId: randomUserId });
                  }}
                >
                  Login user
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
