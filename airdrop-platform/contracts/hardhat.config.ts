/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import 'dotenv/config'

import { NEXERA_CHAINS } from '@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/lib'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomicfoundation/hardhat-verify'

const config = {
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        medadata: true,
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000,
          },
        },
      },
    ],
  },
  etherscan: {
    apiKey: {
      polygon: `${process.env.ETHERSCAN_POLYGON_MAINNET_API_KEY}`,
      polygonAmoy: `${process.env.ETHERSCAN_POLYGON_AMOY_API_KEY}`,
      base: `${process.env.ETHERSCAN_BASE_API_KEY}`,
      bsc: `${process.env.ETHERSCAN_BSC_API_KEY}`,
      mainnet: `${process.env.ETHERSCAN_ETHEREUM_API_KEY}`,
      sepolia: `${process.env.ETHERSCAN_SEPOLIA_API_KEY}`,
      optimisticEthereum: `${process.env.ETHERSCAN_OPTIMISM_API_KEY}`,
    },
    customChains: [
      {
        network: 'polygonAmoy',
        chainId: 80002,
        urls: {
          apiURL: 'https://api-amoy.polygonscan.com/api',
          browserURL: 'https://amoy.polygonscan.com',
        },
      },
    ],
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: false,
  },
  networks: {
    tenderly: {
      chainId: 1,
      url: `https://rpc.tenderly.co/fork/${process.env.TENDERLY_FORK_ID}`,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`, // or any other JSON-RPC provider
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    //testnets
    polygonAmoy: {
      chainId: Number(NEXERA_CHAINS.POLYGON_AMOY),
      url: `${process.env.AMOY_PROVIDER_URL}`,
      accounts: { mnemonic: process.env.DEPLOYMENT_MNEMONIC },
    },
    sepolia: {
      chainId: Number(NEXERA_CHAINS.SEPOLIA),
      url: process.env.SEPOLIA_PROVIDER_URL,
      accounts: { mnemonic: process.env.DEPLOYMENT_MNEMONIC },
    },
  },
}

export default config
