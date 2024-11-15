import type { ITokenInfo } from "@/features/defi-rule-engine/Components/TokenDropDown";

export const SwapOptions = {
  43313: [
    {
      value: "avalanche",
      label: "AVAX",
      icon: "avalanche-chain",
      address: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
      pairs: [
        {
          value: "usdt",
          address: "0x0c1289b6D5335aae075E8Db2AF43E60E1eB2897E",
          swapForY: true,
        },
        {
          value: "usdc",
          address: "0x099deb72844417148E8ee4aA6752d138BedE0c39",
          swapForY: true,
        },
      ],
    },
    {
      value: "usdc",
      label: "USDC",
      icon: "usdc-coin",
      address: "0xB6076C93701D6a07266c31066B298AeC6dd65c2d",
      pairs: [
        {
          value: "avalanche",
          address: "0x099deb72844417148E8ee4aA6752d138BedE0c39",
          swapForY: false,
        },
        {
          value: "usdt",
          address: "0x5091b52d5a2f2dFd5b29B103481d6cAc1Be1eB07",
          swapForY: true,
        },
      ],
    },
    {
      value: "usdt",
      label: "USDT",
      icon: "usdt-coin",
      address: "0xAb231A5744C8E6c45481754928cCfFFFD4aa0732",
      pairs: [
        {
          value: "avalanche",
          address: "0x0c1289b6D5335aae075E8Db2AF43E60E1eB2897E",
          swapForY: false,
        },
        {
          value: "usdc",
          address: "0x5091b52d5a2f2dFd5b29B103481d6cAc1Be1eB07",
          swapForY: true,
        },
      ],
    },
  ] as ITokenInfo[],
  80002: [
    {
      value: "matic",
      label: "MATIC",
      icon: "polygon-matic",
      address: "0x0",
      pairs: [
        {
          value: "usdt",
          address: "0x",
          swapForY: true,
        },
        {
          value: "usdc",
          address: "0x",
          swapForY: true,
        },
      ],
    },
    {
      value: "usdt",
      label: "USDT",
      icon: "usdt-coin",
      address: "0xAb231A5744C8E6c45481754928cCfFFFD4aa0732",
      pairs: [
        {
          value: "avalanche",
          address: "0x0c1289b6D5335aae075E8Db2AF43E60E1eB2897E",
          swapForY: false,
        },
        {
          value: "usdc",
          address: "0x5091b52d5a2f2dFd5b29B103481d6cAc1Be1eB07",
          swapForY: true,
        },
      ],
    },
  ] as ITokenInfo[],
};

export type ChainOptions = keyof typeof SwapOptions;
