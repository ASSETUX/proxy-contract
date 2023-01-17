import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  },
  networks: {
    polygonMumbai: {
      url: process.env.NETWORK_URL,
      chainId: 80001,
      accounts: [process.env.NETWORK_PRIVATE_ACCOUT_KEY!],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.ETH_SCHAN_API_KEY!,
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./contracts/artifacts",
  },
};

export default config;
