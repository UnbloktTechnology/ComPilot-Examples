import { getAirdropTokenConfig } from "../config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import Big from "big.js";

export const formatAirdropTokenAmount = (amount?: bigint): string => {
  const { decimals } = getAirdropTokenConfig();
  if (amount === undefined) return "...";
  const b = new Big(amount.toString());
  return b.div(new Big(10).pow(decimals)).toString();
};
