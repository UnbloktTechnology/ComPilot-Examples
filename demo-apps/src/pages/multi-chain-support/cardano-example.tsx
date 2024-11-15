import dynamic from "next/dynamic";
import { CardanoSupportPage } from "@/features/multi-chain-support/pages/CardanoSupportPage";

export default dynamic(() => Promise.resolve(CardanoSupportPage), {
  ssr: false,
});
