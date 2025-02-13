

import { cronos } from "viem/chains"
import { TOKEN_LIST } from "@/app/abis/Tokens"
import { Address } from "viem";

//For test 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9

export interface IToken {
  name: string;
  isNative: boolean;
  address: string;
  decimal: number;
}

const routerAddr = process.env.NEXT_PUBLIC_DEX_ROUTER;
const factoryAddr = process.env.NEXT_PUBLIC_DEX_FACTORY;

export const WCRO = { name: "WCRO", isNative: false, address: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23", decimal: 18 }
export const WETH = { name: "WETH", isNative: false, address: "0xc0660235ab5a50acab67334c1e2e586915062447", decimal: 18 }
// export const DEXRouter = "0x758919217d8A29bC57899050853d4b3fd359bC2A" 
export const DEXRouter = routerAddr as Address;

export const CONTRACT_ADDRESS = "0x17B094Db1195411872a973fc1482746E6F7Ec976" //will be change

// export const FACTORY = "0x8e8985c56cbfeBA12ec49fCA5891201333F012E5";
export const FACTORY = factoryAddr as Address;

// export const STAKING_ADDRESS = "0xa69609e2D236a43857A4243B2403Ab8dd1b3c5a6"; //sepolia
// export const STAKING_ADDRESS = "0xC6c8058A6118205963D3d1F6F6Cb396577F9e4d4"; //cronos
export const STAKING_ADDRESS = "0x4BA43e9717a0E6eF828AfaDC6808B5d91dBdf118"; //cronos

export const nativeCoin = TOKEN_LIST[0]
export const currentChain = cronos;

export const fee = 0.3; // 100

export const cronosConfig = {
  chainId: 25,
  chainName: 'Cronos',
  network: 'cronos',
  nativeCurrency: {
    decimals: 18,
    name: 'Cronos',
    symbol: 'CRO',
  },
  rpcUrls: [
    'https://cronos.blockpi.network/v1/rpc/public'
  ],
  blockExplorerUrls: [
    'https://cronoscan.com'
  ]
}