import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AirdropLayout } from "@/ui/AirdropLayout";
import { AddressSelect } from "@/ui/components/AddressSelect";
import { AddressSearchBar } from "@/ui/components/AddressSearchBar";
import { Button } from "@/ui/components/Button";
import { RedXIcon } from "@/ui/components/icon/RedXIcon";
import {
  useAuthenticate,
  useCustomerStatus,
  useIdentityWallets,
  useOpenWidget,
  WalletAlreadyLinkedToAnotherIdentity,
} from "@compilot/react-sdk";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "@/ui/components/ConnectWalletButton";
import { type Address } from "viem";
import { getUserAirdropAmount, isUserQualified } from "@/lib/airdropActions";
import { HourglassIcon } from "@/ui/components/icon/HourglassIcon";
import { formatAirdropTokenAmount } from "@/lib/formatDecimalNumber";
import { getAirdropTokenConfig } from "@/config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { Spinner } from "@/ui/components/Spinner";
import { formatAddress } from "@/lib/formatAddress";
import { compilotWalletAdapter } from "@/compilotConfig";
import { ThumbUpIcon } from "@/ui/components/icon/ThumbUpIcon";
import { useIsClaimed } from "@/lib/useIsClaimed";
import { useClaimMutation } from "@/lib/useClaimMutation";
import { AddressCheckedIcon } from "@/ui/components/icon/AddressCheckedIcon";

const AccountPageContext = createContext<{
  modalOpen: boolean;
  forAddress: Address;

  start: (address: Address) => void;
  close: () => void;
}>({
  modalOpen: false,
  forAddress: "0x00",

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  start: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close: () => {},
});

const AccountPageProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [forAddress, setForAddress] = useState<Address>("0x00");

  const start = useCallback(
    (address: Address) => {
      setForAddress(address);
      setModalOpen(true);
    },
    [setForAddress, setModalOpen],
  );

  const close = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const value = useMemo(
    () => ({ modalOpen, forAddress, start, close }),
    [modalOpen, forAddress, start, close],
  );

  return (
    <AccountPageContext.Provider value={value}>
      {children}
    </AccountPageContext.Provider>
  );
};

export default function AccountPage() {
  return (
    <AccountPageProvider>
      <AccountPageContent />
    </AccountPageProvider>
  );
}

const AccountPageContent = () => {
  const account = useAccount();
  const {
    data: isKycAuthenticated,
    authenticate,
    isPending: isAuthenticating,
  } = useAuthenticate();
  const [addressToCheck, setAddressToCheck] = useState<Address | null>(null);
  const { modalOpen } = useContext(AccountPageContext);
  const { address } = useAccount();
  const claimerAddress = addressToCheck ?? address;

  if (!account?.address) {
    return (
      <AirdropLayout
        titleOverwrite="Please connect"
        subtitleOverwrite="You need to be authenticated to manage your account"
      >
        <div className="flex justify-center space-x-4">
          <ConnectWalletButton
            label="Connect your wallet"
            variant="secondary"
          />
        </div>
      </AirdropLayout>
    );
  }

  if (!isKycAuthenticated) {
    return (
      <AirdropLayout
        titleOverwrite="Please connect"
        subtitleOverwrite="You need to be authenticated to manage your account"
      >
        <div className="flex justify-center space-x-4">
          <Button
            variant="primary"
            onClick={() => void authenticate()}
            isLoading={isAuthenticating}
          >
            Prove wallet ownership
          </Button>
        </div>
      </AirdropLayout>
    );
  }

  return (
    <AirdropLayout showTitles={false}>
      <div className="inline-flex w-full max-w-[800px] flex-col items-start justify-start gap-4 rounded-2xl bg-slate-50 p-8">
        <div className="inline-flex items-center justify-start gap-4 self-stretch border-b border-slate-400 pb-6">
          <div className=" text-3xl font-normal leading-loose text-gray-900">
            Profile
          </div>
          <div className="grow">
            <AddressSelect />
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-4 self-stretch pt-2">
          {claimerAddress && <AddressClaimer address={claimerAddress} />}

          <AddressSearchBar
            variant="flat"
            onWalletAddressValid={(address, { clear }) => {
              setAddressToCheck(address);
              clear();
            }}
            isLoading={false}
          />
        </div>
      </div>
      {modalOpen && <AttachWalletModal />}
    </AirdropLayout>
  );
};

export const AddressClaimer = ({ address }: { address: Address }) => {
  const isQualified = isUserQualified(address);
  const amountEligible = getUserAirdropAmount(address);
  const { start: openModal } = useContext(AccountPageContext);
  const isLinked = useIsWalletLinked(address);
  const isClaimedQuery = useIsClaimed(address);
  const claimMutation = useClaimMutation(address);
  const customerStatusQuery = useCustomerStatus();
  const isActive = customerStatusQuery.data === "Active";
  const openWidget = useOpenWidget();
  const isAccountCorrectForClaim = useAccount()?.address === address;

  let step:
    | "not_qualified"
    | "must_link"
    | "must_kyc"
    | "must_switch_account"
    | "can_claim"
    | "claimed";
  if (!isQualified) {
    step = "not_qualified";
  } else if (!isActive) {
    step = "must_kyc";
  } else if (!isLinked) {
    step = "must_link";
  } else if (!isAccountCorrectForClaim) {
    step = "must_switch_account";
  } else if (isClaimedQuery.data === true) {
    step = "claimed";
  } else {
    step = "can_claim";
  }

  return (
    <div className="flex h-16 flex-col items-start justify-start gap-1 self-stretch">
      <div className="flex h-16 flex-col items-start justify-start gap-0.5 self-stretch">
        <div className="flex h-12 flex-col items-start justify-start self-stretch rounded-xl">
          <div className="inline-flex items-center justify-start self-stretch rounded-xl bg-slate-100 p-px">
            <div className="flex h-11 shrink grow basis-0 items-center justify-stretch gap-2 py-2.5 pl-3.5">
              <div className="relative flex h-6 w-6 items-stretch justify-stretch">
                {
                  {
                    not_qualified: <RedXIcon />,
                    must_link: <HourglassIcon />,
                    can_claim: <ThumbUpIcon />,
                    claimed: <AddressCheckedIcon />,
                    must_kyc: <HourglassIcon />,
                    must_switch_account: <RedXIcon />,
                    claiming: <HourglassIcon />,
                  }[step]
                }
              </div>
              <div className=" mr-4 shrink grow basis-0 text-left text-base font-normal leading-normal text-slate-500">
                {address}
              </div>
            </div>

            {step === "must_link" && (
              <Button
                className="h-10 min-w-32 rounded-lg text-sm font-semibold"
                variant="primary"
                disabled={!isQualified}
                isLoading={
                  claimMutation.isPending ||
                  isClaimedQuery.isLoading ||
                  customerStatusQuery.isLoading
                }
                onClick={() => openModal(address)}
              >
                Link to profile
              </Button>
            )}

            {step === "must_kyc" && (
              <Button
                variant="primary"
                className="h-10 min-w-32 rounded-lg text-sm font-semibold"
                isLoading={
                  openWidget.isPending ||
                  isClaimedQuery.isLoading ||
                  customerStatusQuery.isLoading
                }
                onClick={() => void openWidget.openWidget()}
              >
                Activate account
              </Button>
            )}

            {step === "must_switch_account" && (
              <div className="stretch flex h-full min-w-32 items-center justify-center font-bold text-gray-400">
                <p>
                  Please switch your wallet to address {formatAddress(address)}{" "}
                </p>
              </div>
            )}

            {step === "can_claim" && (
              <Button
                className="h-10 min-w-32 rounded-lg text-sm font-semibold"
                variant="primary"
                disabled={!isQualified || !isLinked}
                isLoading={
                  claimMutation.isPending ||
                  isClaimedQuery.isLoading ||
                  customerStatusQuery.isLoading
                }
                onClick={() => void claimMutation.mutateAsync()}
              >
                Claim
              </Button>
            )}

            {step === "claimed" && (
              <div className="stretch flex h-full min-w-32 items-center justify-center font-bold text-gray-400">
                <p>Claimed</p>
              </div>
            )}
          </div>
        </div>
        <div className="inline-flex items-start justify-start gap-2 self-stretch">
          <div className="text-sm font-medium text-slate-600">
            {formatAirdropTokenAmount(amountEligible)} $
            {getAirdropTokenConfig().symbol} allocated{" "}
            {isClaimedQuery.data === true ? "and claimed" : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

const AttachWalletModal = () => {
  const { forAddress, close } = useContext(AccountPageContext);
  const account = useAccount();
  const { addWalletMutation } = useIdentityWallets();

  const isConnected = !account;
  const isCorrectAccount = account?.address === forAddress;
  const isLinking = addWalletMutation.isPending;
  const isLinked = useIsWalletLinked(forAddress);
  const hasNonRetriableError =
    addWalletMutation.error &&
    addWalletMutation.error instanceof WalletAlreadyLinkedToAnotherIdentity;
  const [success, setSuccess] = useState(false);

  const linkAction = useCallback(async () => {
    await addWalletMutation.attachWalletToIdentity(compilotWalletAdapter);
    setSuccess(true);
  }, [addWalletMutation, setSuccess]);

  let step:
    | "must_connect"
    | "must_change_account"
    | "can_link"
    | "linking"
    | "linked"
    | "must_cancel"
    | "success";
  if (isConnected) {
    step = "must_connect";
  } else if (!isCorrectAccount) {
    step = "must_change_account";
  } else if (isLinking) {
    step = "linking";
  } else if (isLinked) {
    if (success) {
      step = "success";
    } else {
      step = "linked";
    }
  } else if (hasNonRetriableError) {
    step = "must_cancel";
  } else {
    step = "can_link";
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={close}
      >
        <div
          className="w-full min-w-[500px] max-w-sm rounded-lg bg-black p-8 text-white shadow-lg "
          onClick={(e) => {
            e.stopPropagation();
            return false;
          }}
        >
          <div className="flex items-center space-x-4 ">
            <h2 className="text-3xl font-normal leading-loose text-stone-100">
              {
                {
                  must_connect: "Connect your wallet",
                  must_change_account: "Please switch your wallet",
                  can_link: "Link this wallet",
                  linking: "Linking wallet",
                  linked: "Wallet is linked to your account",
                  must_cancel: "Cannot link this wallet to your account",
                  success: "Wallet linked o/",
                }[step]
              }
            </h2>
          </div>
          <p className="mt-4 text-left text-sm text-gray-400">
            {
              {
                must_connect: "You need to connect your wallet to link it",
                must_change_account: `Please switch your wallet to address ${forAddress} to link it`,
                can_link: "You can link this wallet",
                linking: "Please sign the request in your wallet  👉",
                linked: "Wallet is linked to your account",
                must_cancel: "Cannot link this wallet to your account",
                success: `You can now login with ${forAddress}`,
              }[step]
            }
            {addWalletMutation.error &&
              (addWalletMutation.error instanceof
              WalletAlreadyLinkedToAnotherIdentity ? (
                <p className="text-red-500">
                  This wallet is already linked to another account
                </p>
              ) : (
                <p>{addWalletMutation.error.message}</p>
              ))}
          </p>
          <div className="items-right mt-4 flex justify-between">
            <Button variant="transparent" onClick={close}>
              Back
            </Button>

            {step === "must_connect" && (
              <ConnectWalletButton label="Connect" variant="primary" />
            )}

            {step === "must_change_account" && (
              <Button variant="primary" disabled={true}>
                Link {formatAddress(forAddress)}
              </Button>
            )}

            {step === "can_link" && (
              <Button variant="primary" onClick={() => void linkAction()}>
                Link {formatAddress(forAddress)}
              </Button>
            )}

            {step === "linking" && (
              <div className="flex items-center space-x-2">
                <Spinner />
                <span>Linking...</span>
              </div>
            )}

            {step === "success" && (
              <Button variant="primary" onClick={close}>
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const useIsWalletLinked = (address: Address) => {
  const { identityWallets } = useIdentityWallets();
  return identityWallets.data?.some(
    (w) => w.address.toLocaleLowerCase() === address.toLocaleLowerCase(),
  );
};
