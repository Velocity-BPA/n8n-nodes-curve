/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Supported blockchain network identifiers for Curve Finance
 */
export const BLOCKCHAIN_IDS = {
  ETHEREUM: 'ethereum',
  ARBITRUM: 'arbitrum',
  AURORA: 'aurora',
  AVALANCHE: 'avalanche',
  BASE: 'base',
  BSC: 'bsc',
  CELO: 'celo',
  FANTOM: 'fantom',
  FRAXTAL: 'fraxtal',
  HARMONY: 'harmony',
  HYPERLIQUID: 'hyperliquid',
  KAVA: 'kava',
  MANTLE: 'mantle',
  MOONBEAM: 'moonbeam',
  OPTIMISM: 'optimism',
  POLYGON: 'polygon',
  SONIC: 'sonic',
  X_LAYER: 'x-layer',
  XDAI: 'xdai',
  ZKEVM: 'zkevm',
  ZKSYNC: 'zksync',
} as const;

export type BlockchainId = (typeof BLOCKCHAIN_IDS)[keyof typeof BLOCKCHAIN_IDS];

/**
 * Blockchain options for n8n UI dropdown
 */
export const BLOCKCHAIN_OPTIONS = [
  { name: 'Ethereum', value: BLOCKCHAIN_IDS.ETHEREUM },
  { name: 'Arbitrum', value: BLOCKCHAIN_IDS.ARBITRUM },
  { name: 'Aurora', value: BLOCKCHAIN_IDS.AURORA },
  { name: 'Avalanche', value: BLOCKCHAIN_IDS.AVALANCHE },
  { name: 'Base', value: BLOCKCHAIN_IDS.BASE },
  { name: 'BSC (Binance Smart Chain)', value: BLOCKCHAIN_IDS.BSC },
  { name: 'Celo', value: BLOCKCHAIN_IDS.CELO },
  { name: 'Fantom', value: BLOCKCHAIN_IDS.FANTOM },
  { name: 'Fraxtal', value: BLOCKCHAIN_IDS.FRAXTAL },
  { name: 'Harmony', value: BLOCKCHAIN_IDS.HARMONY },
  { name: 'Hyperliquid', value: BLOCKCHAIN_IDS.HYPERLIQUID },
  { name: 'Kava', value: BLOCKCHAIN_IDS.KAVA },
  { name: 'Mantle', value: BLOCKCHAIN_IDS.MANTLE },
  { name: 'Moonbeam', value: BLOCKCHAIN_IDS.MOONBEAM },
  { name: 'Optimism', value: BLOCKCHAIN_IDS.OPTIMISM },
  { name: 'Polygon', value: BLOCKCHAIN_IDS.POLYGON },
  { name: 'Sonic', value: BLOCKCHAIN_IDS.SONIC },
  { name: 'X-Layer', value: BLOCKCHAIN_IDS.X_LAYER },
  { name: 'xDai (Gnosis)', value: BLOCKCHAIN_IDS.XDAI },
  { name: 'Polygon zkEVM', value: BLOCKCHAIN_IDS.ZKEVM },
  { name: 'zkSync Era', value: BLOCKCHAIN_IDS.ZKSYNC },
];

/**
 * Chains that support Curve Lending (LlamaLend)
 */
export const LENDING_SUPPORTED_CHAINS = [
  BLOCKCHAIN_IDS.ETHEREUM,
  BLOCKCHAIN_IDS.ARBITRUM,
  BLOCKCHAIN_IDS.OPTIMISM,
  BLOCKCHAIN_IDS.FRAXTAL,
  BLOCKCHAIN_IDS.SONIC,
] as const;

export type LendingSupportedChain = (typeof LENDING_SUPPORTED_CHAINS)[number];

/**
 * Lending chain options for n8n UI dropdown
 */
export const LENDING_CHAIN_OPTIONS = [
  { name: 'Ethereum', value: BLOCKCHAIN_IDS.ETHEREUM },
  { name: 'Arbitrum', value: BLOCKCHAIN_IDS.ARBITRUM },
  { name: 'Optimism', value: BLOCKCHAIN_IDS.OPTIMISM },
  { name: 'Fraxtal', value: BLOCKCHAIN_IDS.FRAXTAL },
  { name: 'Sonic', value: BLOCKCHAIN_IDS.SONIC },
];

/**
 * Chain metadata including chain IDs and explorer URLs
 */
export const CHAIN_METADATA: Record<
  BlockchainId,
  {
    name: string;
    chainId: number;
    explorer: string;
    nativeCurrency: string;
  }
> = {
  [BLOCKCHAIN_IDS.ETHEREUM]: {
    name: 'Ethereum',
    chainId: 1,
    explorer: 'https://etherscan.io',
    nativeCurrency: 'ETH',
  },
  [BLOCKCHAIN_IDS.ARBITRUM]: {
    name: 'Arbitrum One',
    chainId: 42161,
    explorer: 'https://arbiscan.io',
    nativeCurrency: 'ETH',
  },
  [BLOCKCHAIN_IDS.AURORA]: {
    name: 'Aurora',
    chainId: 1313161554,
    explorer: 'https://explorer.aurora.dev',
    nativeCurrency: 'ETH',
  },
  [BLOCKCHAIN_IDS.AVALANCHE]: {
    name: 'Avalanche C-Chain',
    chainId: 43114,
    explorer: 'https://snowtrace.io',
    nativeCurrency: 'AVAX',
  },
  [BLOCKCHAIN_IDS.BASE]: {
    name: 'Base',
    chainId: 8453,
    explorer: 'https://basescan.org',
    nativeCurrency: 'ETH',
  },
  [BLOCKCHAIN_IDS.BSC]: {
    name: 'BNB Smart Chain',
    chainId: 56,
    explorer: 'https://bscscan.com',
    nativeCurrency: 'BNB',
  },
  [BLOCKCHAIN_IDS.CELO]: {
    name: 'Celo',
    chainId: 42220,
    explorer: 'https://celoscan.io',
    nativeCurrency: 'CELO',
  },
  [BLOCKCHAIN_IDS.FANTOM]: {
    name: 'Fantom Opera',
    chainId: 250,
    explorer: 'https://ftmscan.com',
    nativeCurrency: 'FTM',
  },
  [BLOCKCHAIN_IDS.FRAXTAL]: {
    name: 'Fraxtal',
    chainId: 252,
    explorer: 'https://fraxscan.com',
    nativeCurrency: 'frxETH',
  },
  [BLOCKCHAIN_IDS.HARMONY]: {
    name: 'Harmony One',
    chainId: 1666600000,
    explorer: 'https://explorer.harmony.one',
    nativeCurrency: 'ONE',
  },
  [BLOCKCHAIN_IDS.HYPERLIQUID]: {
    name: 'Hyperliquid',
    chainId: 998,
    explorer: 'https://explorer.hyperliquid.xyz',
    nativeCurrency: 'HYPE',
  },
  [BLOCKCHAIN_IDS.KAVA]: {
    name: 'Kava EVM',
    chainId: 2222,
    explorer: 'https://kavascan.com',
    nativeCurrency: 'KAVA',
  },
  [BLOCKCHAIN_IDS.MANTLE]: {
    name: 'Mantle',
    chainId: 5000,
    explorer: 'https://mantlescan.xyz',
    nativeCurrency: 'MNT',
  },
  [BLOCKCHAIN_IDS.MOONBEAM]: {
    name: 'Moonbeam',
    chainId: 1284,
    explorer: 'https://moonscan.io',
    nativeCurrency: 'GLMR',
  },
  [BLOCKCHAIN_IDS.OPTIMISM]: {
    name: 'Optimism',
    chainId: 10,
    explorer: 'https://optimistic.etherscan.io',
    nativeCurrency: 'ETH',
  },
  [BLOCKCHAIN_IDS.POLYGON]: {
    name: 'Polygon',
    chainId: 137,
    explorer: 'https://polygonscan.com',
    nativeCurrency: 'MATIC',
  },
  [BLOCKCHAIN_IDS.SONIC]: {
    name: 'Sonic',
    chainId: 146,
    explorer: 'https://sonicscan.org',
    nativeCurrency: 'S',
  },
  [BLOCKCHAIN_IDS.X_LAYER]: {
    name: 'X Layer',
    chainId: 196,
    explorer: 'https://www.oklink.com/xlayer',
    nativeCurrency: 'OKB',
  },
  [BLOCKCHAIN_IDS.XDAI]: {
    name: 'Gnosis Chain',
    chainId: 100,
    explorer: 'https://gnosisscan.io',
    nativeCurrency: 'xDAI',
  },
  [BLOCKCHAIN_IDS.ZKEVM]: {
    name: 'Polygon zkEVM',
    chainId: 1101,
    explorer: 'https://zkevm.polygonscan.com',
    nativeCurrency: 'ETH',
  },
  [BLOCKCHAIN_IDS.ZKSYNC]: {
    name: 'zkSync Era',
    chainId: 324,
    explorer: 'https://explorer.zksync.io',
    nativeCurrency: 'ETH',
  },
};
