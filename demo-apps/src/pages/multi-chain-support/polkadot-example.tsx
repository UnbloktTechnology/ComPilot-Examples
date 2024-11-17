import dynamic from "next/dynamic";
import { PolkadotSupportPage } from "@/features/multi-chain-support/pages/PolkadotSupportPage";

export default dynamic(() => Promise.resolve(PolkadotSupportPage), {
  ssr: false,
});
