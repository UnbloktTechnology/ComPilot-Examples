import dynamic from "next/dynamic";
import { SolanaSupportPage } from "@/features/multi-chain-support/pages/SolanaSupportPage";

export default dynamic(() => Promise.resolve(SolanaSupportPage), {
  ssr: false,
});
