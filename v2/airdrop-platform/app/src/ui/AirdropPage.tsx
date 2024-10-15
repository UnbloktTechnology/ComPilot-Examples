import { AirdropLayout } from "@/ui/AirdropLayout";
import { Button } from "@/ui/components/Button";
import {
  useAuthenticate,
  useCustomerStatus,
  useDisconnect,
  useOpenWidget,
} from "@compilot/react-sdk";
import { ConnectWalletButton } from "@/ui/components/ConnectWalletButton";
import { useClaimMutation } from "@/lib/useClaimMutation";
import { useClaimUiState, useCurrentUiStep } from "@/lib/useClaimUiState";
import { useWalletAddress } from "@/lib/useWalletAddress";
import { AddressSearchBar } from "./components/AddressSearchBar";
import { LogoutButton } from "./components/LogoutButton";
import { useConfig, useSwitchChain } from "wagmi";
import {
  getAirdropTokenConfig,
  getDeploymentChain,
} from "@/config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { AddTokenButton } from "./components/AddTokenButton";
import {
  useRedirectToAccountPage,
  useRedirectToCheckWallet,
} from "@/lib/navigation";
import { useEffect } from "react";
import { watchAccount } from "wagmi/actions";
import { useRouter } from "next/router";
import { getUserAirdropAmount } from "@/lib/airdropActions";

export const AirdropPage = () => {
  const uiStep = useCurrentUiStep();
  const { isConnected } = useWalletAddress();
  const customerData = useCustomerStatus();
  const openWidget = useOpenWidget();
  const claimMutation = useClaimMutation();
  const authenticate = useAuthenticate();
  const { switchChain } = useSwitchChain();
  const { symbol } = getAirdropTokenConfig();
  const isCustomerActive = customerData.data === "Active";
  const redirectToCheckWallet = useRedirectToCheckWallet();
  const redirectToAccount = useRedirectToAccountPage();
  const router = useRouter();
  const routeAddress = router.query.address as string | undefined;
  const { disconnect } = useDisconnect();
  const { address } = useWalletAddress();
  const isClaimed = useClaimUiState().claim;
  const dataIsLoading = isClaimed.loading;

  // when the account is changed, go to the check page for it
  const config = useConfig();
  useEffect(() => {
    const unsubscribe = watchAccount(config, {
      onChange: (newAccount) => {
        if (
          newAccount?.address &&
          newAccount.address.toLocaleLowerCase() !==
            routeAddress?.toLocaleLowerCase()
        ) {
          void disconnect();
          redirectToCheckWallet(newAccount.address);
        }
      },
    });

    return unsubscribe;
  }, [config, redirectToCheckWallet, routeAddress, disconnect]);

  return (
    <AirdropLayout>
      {uiStep === "address_set" && (
        <>
          {!isConnected && (
            <>
              <AddressSearchBar
                variant="outlined"
                onWalletAddressValid={redirectToCheckWallet}
                isLoading={false}
              />
              or
            </>
          )}
          <ConnectWalletButton
            label="Connect your wallet"
            variant="secondary"
          />
        </>
      )}

      {uiStep === "wallet_change_address" && (
        <>
          Please set the wallet address to the one you want to use for the
          airdrop.
        </>
      )}

      {uiStep === "eligibility" && (
        <LogoutButton variant="secondary" label="Try another wallet" />
      )}

      {uiStep === "chain_set" && (
        <div className="flex justify-center space-x-4">
          <LogoutButton variant="primary" label="Try another wallet" />
          <Button
            variant="secondary"
            onClick={() => switchChain({ chainId: getDeploymentChain().id })}
            isLoading={dataIsLoading}
          >
            Switch to {getDeploymentChain().name}
          </Button>
        </div>
      )}

      {uiStep === "wallet_connect" && (
        <div className="flex justify-center space-x-4">
          {isClaimed.claimed ? (
            <Button
              variant="primary"
              onClick={() => redirectToAccount()}
              isLoading={dataIsLoading}
            >
              Use another wallet
            </Button>
          ) : (
            <LogoutButton
              variant="primary"
              label="Use another wallet"
              isLoading={dataIsLoading}
            />
          )}
          <ConnectWalletButton
            label={
              isClaimed.claimed
                ? "Connect to use another wallet"
                : "Connect your wallet"
            }
            variant="secondary"
            isLoading={dataIsLoading}
          />
        </div>
      )}

      {uiStep === "kyc_connect" && (
        <div className="flex justify-center space-x-4">
          <LogoutButton variant="primary" label="Try another wallet" />
          <Button
            variant="secondary"
            onClick={() => void authenticate.authenticate()}
            disabled={isCustomerActive}
            isLoading={authenticate.isPending || dataIsLoading}
            id="identity-btn"
          >
            Prove wallet ownership
          </Button>
        </div>
      )}

      {uiStep === "kyc" && (
        <div className="flex justify-center space-x-4">
          <LogoutButton variant="primary" label="Try another wallet" />
          <Button
            variant="secondary"
            onClick={() => void openWidget.openWidget()}
            disabled={isCustomerActive}
            isLoading={openWidget.isPending || dataIsLoading}
            id="identity-btn"
          >
            Begin identity verification
          </Button>
        </div>
      )}

      {uiStep === "kyc_data_loading" && (
        <div className="flex justify-center space-x-4">
          <LogoutButton variant="primary" label="Try another wallet" />
          <Button variant="secondary" isLoading={true}>
            Kyc Data loading
          </Button>
        </div>
      )}

      {uiStep === "kyc_processing" && (
        <div className="flex justify-center space-x-4">
          <LogoutButton variant="primary" label="Try another wallet" />
          <Button variant="secondary" disabled isLoading={dataIsLoading}>
            Identity verification in progress
          </Button>
        </div>
      )}

      {uiStep === "claim" && (
        <div className="flex justify-center space-x-4">
          <LogoutButton variant="primary" label="Use another wallet" />

          {authenticate.data === undefined && (
            <Button variant="secondary" disabled isLoading={dataIsLoading}>
              Loading wallet data
            </Button>
          )}

          {authenticate.data === true && (
            <Button
              variant="secondary"
              disabled={!isCustomerActive || claimMutation.isPending}
              onClick={() => claimMutation.mutate()}
              id="claim-btn"
              isLoading={claimMutation.isPending || dataIsLoading}
            >
              Claim tokens
            </Button>
          )}

          {authenticate.data === false && (
            <Button
              variant="secondary"
              onClick={() => void authenticate.authenticate()}
              disabled={authenticate.isPending}
              isLoading={authenticate.isPending || dataIsLoading}
              id="identity-btn"
            >
              Authenticate wallet to start claiming.
            </Button>
          )}
        </div>
      )}

      {uiStep === "done" && (
        <div className="flex flex-col justify-center space-y-4">
          <p>
            You already claimed your {getUserAirdropAmount(address)} {symbol}
          </p>
          <div className="flex justify-center space-x-4">
            {isClaimed.claimed ? (
              <Button variant="secondary" onClick={() => redirectToAccount()}>
                Use another wallet
              </Button>
            ) : (
              <LogoutButton variant="secondary" label="Use another wallet" />
            )}
            <AddTokenButton variant="primary" />
          </div>
        </div>
      )}
    </AirdropLayout>
  );
};
