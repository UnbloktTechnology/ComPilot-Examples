import { getUserAirdropAmount, isUserQualified } from "./airdropActions";
import { UserRejectedRequestError, type Address } from "viem";
import { useAuthenticate, useCustomerStatus } from "@compilot/react-sdk";
import { useWalletAddress } from "./useWalletAddress";
import { useRouter } from "next/router";
import { useClaimMutation } from "./useClaimMutation";
import { useChainId } from "wagmi";
import {
  getAirdropTokenConfig,
  getDeploymentChain,
} from "../config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { formatAirdropTokenAmount } from "./formatDecimalNumber";
import { AirdropTokenIcon } from "@/ui/components/icon/AirdropTokenIcon";
import { ChainIcon } from "@/ui/components/icon/ChainIcon";
import { formatAddress } from "./formatAddress";
import { useIsClaimed } from "./useIsClaimed";

export type UiState = {
  // wallet can be set but not connected as it's present in the url
  wallet: {
    connected: boolean;
    address: Address | undefined;
    chainIsCorrect: boolean;
    addressIsCorrect: boolean; // check address is not the one connected
  };
  route: { check: boolean };
  eligibility: { qualified: boolean };
  kyc: {
    loading: boolean;
    connected: boolean;
    active: boolean;
    failed: boolean;
    processing: boolean;
  };
  claim: {
    claimed: boolean;
    claiming: boolean;
    rejected: boolean;
    loading: boolean;
  };
};

export const useClaimUiState = (): UiState => {
  const { isConnected, address } = useWalletAddress();
  const customerStatus = useCustomerStatus();
  const router = useRouter();
  const authenticate = useAuthenticate();
  const isQualified = address ? isUserQualified(address) : false;
  const isClaimed = useIsClaimed();
  const claimMutation = useClaimMutation();
  const chainId = useChainId();
  const chainIsCorrect = chainId === getDeploymentChain().id;
  const isInCheckPage = router.query.address !== undefined;
  const addressIsCorrect = address === router.query.address;

  return {
    wallet: {
      connected: isConnected,
      address: address,
      chainIsCorrect,
      addressIsCorrect,
    },
    route: { check: isInCheckPage },
    eligibility: { qualified: isQualified },
    kyc: {
      loading:
        customerStatus.isLoading ||
        customerStatus.data === undefined ||
        authenticate.isPending,
      connected: authenticate.data === true,
      active: customerStatus.data === "Active",
      failed:
        customerStatus.data === "Rejected" || customerStatus.data === "Failed",
      processing: !!customerStatus.data && customerStatus.data !== "Active",
    },
    claim: {
      claimed: isClaimed?.data === true,
      rejected: claimMutation.data instanceof UserRejectedRequestError,
      claiming: claimMutation.isPending,
      loading: isClaimed?.isLoading,
    },
  };
};

export type UiStep =
  | "address_set" // we need an address to work with
  | "chain_set" // we need the correct chain
  | "eligibility" // check if the address is qualified
  | "wallet_connect" // connect the wallet if needed
  | "wallet_change_address" // change the wallet address
  | "kyc_connect" // connect the kyc
  | "kyc" // ask for kyc
  | "kyc_data_loading" // kyc data loaded
  | "kyc_processing" // kyc is being processed
  | "kyc_failed" // kyc failed
  | "claim" // claim the tokens
  | "done"; // all done

export const useCurrentUiStep = (): UiStep => {
  const uiState = useClaimUiState();

  if (!uiState.wallet.address) return "address_set";
  if (!uiState.route.check) return "address_set";
  if (!uiState.wallet.chainIsCorrect) return "chain_set";
  if (!uiState.eligibility.qualified) return "eligibility";
  if (!uiState.wallet.connected) return "wallet_connect";
  if (uiState.claim.claimed) return "done";
  if (!uiState.wallet.addressIsCorrect) return "wallet_change_address";
  if (!uiState.kyc.connected) return "kyc_connect";
  if (uiState.kyc.loading) return "kyc_data_loading";
  if (!uiState.kyc.active) {
    if (uiState.kyc.failed) return "kyc_failed";
    if (uiState.kyc.processing) return "kyc_processing";
    return "kyc";
  }
  if (!uiState.claim.claimed) return "claim";
  if (uiState.claim.claiming) return "claim";

  return "done";
};

export const useTitles = (): {
  title: React.ReactNode;
  subtitle: React.ReactNode;
} => {
  const uiState = useClaimUiState();
  const { address } = useWalletAddress();
  const allowance = address ? getUserAirdropAmount(address) : 0n;
  const isClaimed = useIsClaimed();
  const { symbol } = getAirdropTokenConfig();
  const chainId = useChainId();

  if (!uiState.wallet.address)
    return {
      title: "Let's claim some tokens",
      subtitle: "Check if your wallet is eligible",
    };

  if (!uiState.route.check)
    return {
      title: "Let's claim some tokens",
      subtitle: "Let's check if you qualify for the airdrop",
    };

  if (!uiState.eligibility.qualified)
    return {
      title: "This wallet doesn't qualify",
      subtitle: (
        <>
          Unfortunately, the wallet <ChainIcon chainId={chainId} />{" "}
          {formatAddress(address)} doesn&apos;t qualify
        </>
      ),
    };

  if (!allowance)
    return {
      title: "No allocation",
      subtitle: (
        <>
          Unfortunately, there is no allocation for the wallet{" "}
          <ChainIcon chainId={chainId} /> {formatAddress(address)}
        </>
      ),
    };

  if (uiState.claim.claimed)
    return {
      title: "Airdrop already claimed",
      subtitle: (
        <>
          Congratulations you already claimed your airdrop for the wallet{" "}
          <ChainIcon chainId={chainId} /> {formatAddress(address)}
        </>
      ),
    };

  if (!uiState.wallet.connected)
    return {
      title: "You scored allocation!",
      subtitle: (
        <>
          Congrats, the allocation for the wallet{" "}
          <ChainIcon chainId={chainId} /> {formatAddress(address)} is{" "}
          <AirdropTokenIcon /> {formatAirdropTokenAmount(allowance)} ${symbol}.
        </>
      ),
    };

  if (!uiState.wallet.chainIsCorrect)
    return {
      title: "Wrong chain",
      subtitle: (
        <>
          Please switch to {getDeploymentChain().name} to claim{" "}
          <AirdropTokenIcon /> {formatAirdropTokenAmount(allowance)} ${symbol}{" "}
          for <ChainIcon chainId={chainId} /> {formatAddress(address)}.
        </>
      ),
    };

  if (!uiState.kyc.active && uiState.kyc.failed)
    return {
      title: "Identity verification rejected",
      subtitle:
        "Following the identity verification we determined that you are not allowed to claim the airdrop.",
    };

  if (!uiState.kyc.active)
    return {
      title: "Let's claim some tokens",
      subtitle: (
        <>
          Now we need to verify your identity before you can claim{" "}
          <AirdropTokenIcon /> {formatAirdropTokenAmount(allowance)} {symbol}{" "}
          for <ChainIcon chainId={chainId} /> {formatAddress(address)}.
        </>
      ),
    };

  if (uiState.kyc.processing)
    return {
      title: "Identity verification in progress",
      subtitle: "Please wait while we verify your identity",
    };

  if (!uiState.kyc.connected)
    return {
      title: "You scored allocation!",
      subtitle: (
        <>
          Congrats, the allocation for the wallet{" "}
          <ChainIcon chainId={chainId} /> {formatAddress(address)} is{" "}
          <AirdropTokenIcon /> {formatAirdropTokenAmount(allowance)} ${symbol}.
        </>
      ),
    };

  if (!uiState.claim.claimed && isClaimed?.isLoading)
    return {
      title: "Claiming your tokens...",
      subtitle: "Checking wallet balance...",
    };

  if (!uiState.claim.claimed)
    return {
      title: `Let's claim some $${symbol}`,
      subtitle: `You can claim ${formatAirdropTokenAmount(allowance)} $${symbol} now.`,
    };

  return {
    title: "Tokens were already claimed",
    subtitle: (
      <>
        Congratulations you already claimed your airdrop for the wallet{" "}
        <ChainIcon chainId={chainId} /> {formatAddress(address)}
      </>
    ),
  };
};
