import { WalletMenuIcon } from "./icon/WalletMenuIcon";

import { DisconnectIcon } from "./icon/DisconnectIcon";
import { ArrowDownIcon } from "./icon/ArrowDownIcon";
import { DropDownMenu } from "./DropDownMenu";
import { useWalletAddress } from "@/lib/useWalletAddress";
import { formatAddress } from "@/lib/formatAddress";
import { useLogout } from "@/lib/useLogout";
import { useUsername } from "@/lib/useUsername";
import { AddAddressIcon } from "./icon/AddAddressIcon";
import { useRedirectToAccountPage } from "@/lib/navigation";
import { useAuthenticate, useCustomerStatus } from "@compilot/react-sdk";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { Button } from "./Button";
import { useAccount } from "wagmi";

export const WalletMenu = () => {
  const account = useAccount();
  const { address } = useWalletAddress();
  const authenticate = useAuthenticate();
  const username = useUsername();
  const logout = useLogout();
  const customerStatus = useCustomerStatus();
  const isLoading = customerStatus.isLoading;
  const isCustomerActive = customerStatus.data === "Active";
  const redirectToAccountPage = useRedirectToAccountPage();
  const isKycAuthenticated = authenticate.data === true;

  if (!account?.address || !address) {
    return (
      <div className="flex h-14 justify-center space-x-4 px-4 py-2 text-sm">
        <ConnectWalletButton
          label="Connect your wallet"
          variant="black"
          className="text-sm"
        />
      </div>
    );
  }

  if (!isKycAuthenticated) {
    return (
      <div className="flex h-14 justify-center space-x-4 px-4 py-2 text-sm">
        <Button
          variant="black"
          onClick={() => void authenticate.authenticate()}
          disabled={isCustomerActive}
          isLoading={authenticate.isPending}
          id="identity-btn"
        >
          Prove wallet ownership
        </Button>
      </div>
    );
  }
  return (
    <DropDownMenu>
      <DropDownMenu.Button>
        <div className="inline-flex h-9 items-center justify-start gap-1 rounded-3xl bg-black px-4 py-1">
          {isCustomerActive && (
            <div className="relative h-4 w-4">
              <WalletMenuIcon />
            </div>
          )}
          {isLoading && <div className="relative h-4 w-4">...</div>}
          <div className="font-['Aeonik Pro'] text-center text-sm font-normal leading-none text-white">
            {username}
          </div>
          <div className="relative h-4 w-4">
            <ArrowDownIcon />
          </div>
        </div>
      </DropDownMenu.Button>

      <DropDownMenu.DropDown>
        <DropDownMenu.Item>
          <div className="flex items-center justify-start gap-1">
            <div className="text-gray-95 text-base font-normal leading-normal">
              Connected With
            </div>
          </div>
        </DropDownMenu.Item>

        <DropDownMenu.Item>
          <div className="flex items-center justify-start gap-1">
            <div className=" text-gray-950">{formatAddress(address, 10)}</div>
          </div>
        </DropDownMenu.Item>

        {isCustomerActive && (
          <DropDownMenu.Item selectable onClick={() => redirectToAccountPage()}>
            <div className="flex items-center justify-start gap-1 ">
              <div className="relative h-5 w-5">
                <AddAddressIcon />
              </div>
              <div className="text-base font-normal leading-normal text-gray-950">
                Add another wallet
              </div>
            </div>
          </DropDownMenu.Item>
        )}

        <DropDownMenu.Item selectable onClick={logout}>
          <div className="flex items-center justify-start gap-1">
            <div className="relative h-5 w-5">
              <DisconnectIcon />
            </div>
            <div className="text-base font-normal leading-normal text-gray-950">
              Disconnect
            </div>
          </div>
        </DropDownMenu.Item>
      </DropDownMenu.DropDown>
    </DropDownMenu>
  );
};
