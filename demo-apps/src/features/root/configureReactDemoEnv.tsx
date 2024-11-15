import { env } from "@/env.mjs";
import { _setInternalConfig } from "@compilot/react-sdk";

console.log("Setting environment to: ", env.NEXT_PUBLIC_ENVIRONMENT);

_setInternalConfig({ env: env.NEXT_PUBLIC_ENVIRONMENT });
