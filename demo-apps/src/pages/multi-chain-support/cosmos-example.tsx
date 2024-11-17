import dynamic from "next/dynamic";
import { CosmosSupportPage } from "@/features/multi-chain-support/pages/CosmosSupportPage";

export default dynamic(() => Promise.resolve(CosmosSupportPage), {
  ssr: false,
});
