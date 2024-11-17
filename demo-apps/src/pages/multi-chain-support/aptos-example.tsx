import dynamic from "next/dynamic";
import { AptosSupportPage } from "@/features/multi-chain-support/pages/AptosSupportPage";

export default dynamic(() => Promise.resolve(AptosSupportPage), { ssr: false });
