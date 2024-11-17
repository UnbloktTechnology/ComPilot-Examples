import type { EvmChainId } from "@nexeraid/identity-schemas";
import { NEXERA_EVM_CHAINS } from "@nexeraid/identity-schemas";
import {
  ExampleGatedNFTMinterAddress_polygonAmoy,
  ExampleGatedNFTMinterAddress_sepolia,
  ExampleNFTMinterAddress_polygonAmoy,
  ExampleNFTMinterAddress_sepolia,
} from "@nexeraid/sig-gating-contracts-sdk/addresses";

export const getGatedContractAddress = (chainId: EvmChainId) => {
  return chainId === NEXERA_EVM_CHAINS.SEPOLIA
    ? ExampleGatedNFTMinterAddress_sepolia
    : chainId === NEXERA_EVM_CHAINS.POLYGON_AMOY
      ? ExampleGatedNFTMinterAddress_polygonAmoy
      : ExampleGatedNFTMinterAddress_polygonAmoy;
};

export const getNonGatedContractAddress = (chainId: EvmChainId) => {
  return chainId === NEXERA_EVM_CHAINS.SEPOLIA
    ? ExampleNFTMinterAddress_sepolia
    : chainId === NEXERA_EVM_CHAINS.POLYGON_AMOY
      ? ExampleNFTMinterAddress_polygonAmoy
      : ExampleGatedNFTMinterAddress_polygonAmoy;
};
