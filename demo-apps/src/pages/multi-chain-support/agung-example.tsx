import dynamic from "next/dynamic";
import { AgungSupportPage } from "@/features/multi-chain-support/pages/AgungSupportPage";

export default dynamic(() => Promise.resolve(AgungSupportPage), {
  ssr: false,
});
