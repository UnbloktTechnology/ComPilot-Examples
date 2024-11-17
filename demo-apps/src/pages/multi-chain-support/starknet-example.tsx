import dynamic from "next/dynamic";
import { StarknetSupportPage } from "@/features/multi-chain-support/pages/StarknetSupportPage";

export default dynamic(() => Promise.resolve(StarknetSupportPage), {
  ssr: false,
});
