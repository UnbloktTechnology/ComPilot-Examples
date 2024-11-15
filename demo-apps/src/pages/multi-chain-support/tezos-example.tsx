import dynamic from "next/dynamic";
import { TezosSupportPage } from "@/features/multi-chain-support/pages/TezosSupportPage";

export default dynamic(() => Promise.resolve(TezosSupportPage), { ssr: false });
