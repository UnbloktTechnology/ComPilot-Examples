import { env } from "@/env.mjs";
import { _setInternalConfig as _setInternalConfigReact } from "@compilot/react-sdk";
import { _setInternalConfig as _setInternalConfigNode } from "@compilot/js-sdk";

// this is for internal ComPilot use only

console.debug("_setInternalConfigReact", { env: env.NEXT_PUBLIC_ENVIRONMENT });
_setInternalConfigReact({ env: env.NEXT_PUBLIC_ENVIRONMENT });
console.debug("_setInternalConfigNode", { env: env.NEXT_PUBLIC_ENVIRONMENT });
_setInternalConfigNode({ env: env.NEXT_PUBLIC_ENVIRONMENT });
