import React from "react";
import { AirdropLayout } from "@/ui/AirdropLayout";
import { useRouter } from "next/router";
import { Button } from "@/ui/components/Button";

import { useRedirectToCheckWallet } from "@/lib/navigation";
import { useWalletAddress } from "@/lib/useWalletAddress";
import { LogoutButton } from "@/ui/components/LogoutButton";

export default function AllocationCheck() {
  const router = useRouter();
  const error = router.query.error as string;
  const { address } = useWalletAddress();
  const redirectToCheckWallet = useRedirectToCheckWallet();

  return (
    <AirdropLayout
      titleOverwrite="Tokens claim unsuccessful"
      subtitleOverwrite="Unfortunately, we can't allow token claim for you due to :"
    >
      <textarea
        className="border-white-400 focus:ring-white-400 h-24 w-full max-w-md resize-none rounded-lg border bg-slate-500 bg-opacity-25 p-4 text-white placeholder-gray-300 focus:border-transparent focus:outline-none focus:ring-2"
        placeholder="Reason for rejection goes here"
        readOnly
        defaultValue={error}
        maxLength={error?.length}
      />

      <div className="flex w-full flex-row items-center justify-center gap-4">
        <LogoutButton variant="primary" label="Try another wallet" />

        <Button
          variant="secondary"
          onClick={() => address && redirectToCheckWallet(address)}
        >
          Try again
        </Button>
      </div>
    </AirdropLayout>
  );
}
