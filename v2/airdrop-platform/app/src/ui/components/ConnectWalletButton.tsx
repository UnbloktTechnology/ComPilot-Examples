import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Button, type ButtonVariant } from "./Button";
import type { Address } from "@nexeraid/identity-schemas";
import { useRedirectToCheckWallet } from "@/lib/navigation";

interface ConnectButtonProps {
  label: string;
  variant: ButtonVariant;
  className?: string;
  isLoading?: boolean;
}

export const ConnectWalletButton = ({
  label,
  variant,
  className,
  isLoading,
}: ConnectButtonProps) => {
  const redirectToCheckWallet = useRedirectToCheckWallet();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(ready
              ? { className: "flex items-stretch justify-stretch" }
              : {
                  "aria-hidden": true,
                  className: "opacity-0 pointer-events-none select-none",
                })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    variant={variant}
                    className={className}
                    isLoading={isLoading}
                  >
                    {label}
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant={variant}
                    className={className}
                    isLoading={isLoading}
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className="flex gap-3">
                  <Button
                    onClick={openChainModal}
                    variant="primary"
                    className={`flex flex-row items-center gap-2 ${className}`}
                    isLoading={isLoading}
                  >
                    {chain.iconUrl && (
                      <Image
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        height={12}
                        width={12}
                      />
                    )}
                    {chain.name}
                  </Button>
                  <Button
                    onClick={openAccountModal}
                    variant="primary"
                    className={className}
                    isLoading={isLoading}
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                  <Button
                    onClick={() =>
                      redirectToCheckWallet(account.address as Address)
                    }
                    variant={variant}
                    className={className}
                    isLoading={isLoading}
                  >
                    Check this wallet for airdrop eligibility
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
