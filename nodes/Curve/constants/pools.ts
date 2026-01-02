/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Well-known Curve pool identifiers
 */
export const COMMON_POOL_IDS = {
  /** 3pool - DAI/USDC/USDT base pool */
  THREE_POOL: '3pool',
  /** Tricrypto2 - USDT/WBTC/ETH */
  TRICRYPTO2: 'tricrypto2',
  /** stETH - ETH/stETH pool */
  STETH: 'steth',
  /** FRAX/USDC pool */
  FRAXUSDC: 'fraxusdc',
  /** sUSD metapool */
  SUSD: 'susd',
  /** LUSD metapool */
  LUSD: 'lusd',
  /** GUSD metapool */
  GUSD: 'gusd',
  /** BUSD metapool */
  BUSD: 'busd',
  /** USDD metapool */
  USDD: 'usdd',
  /** crvUSD/USDC pool */
  CRVUSD_USDC: 'factory-crvusd-0',
  /** crvUSD/USDT pool */
  CRVUSD_USDT: 'factory-crvusd-1',
  /** crvUSD/FRAX pool */
  CRVUSD_FRAX: 'factory-crvusd-2',
} as const;

export type CommonPoolId = (typeof COMMON_POOL_IDS)[keyof typeof COMMON_POOL_IDS];

/**
 * crvUSD contract addresses by chain
 */
export const CRVUSD_ADDRESSES: Record<string, string> = {
  ethereum: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
  arbitrum: '0x498Bf2B1e120FeD3ad3D42EA2165E9b73f99C1e5',
  optimism: '0xc52d7f23a2e460248db6ee192cb23dd12bddcbc4',
};

/**
 * scrvUSD (savings crvUSD) contract addresses
 */
export const SCRVUSD_ADDRESSES: Record<string, string> = {
  ethereum: '0x0655977FEb2f289A4aB78af67BAB0d17aAb84367',
};

/**
 * Gauge controller addresses
 */
export const GAUGE_CONTROLLER_ADDRESSES: Record<string, string> = {
  ethereum: '0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB',
};

/**
 * Pool type classifications
 */
export const POOL_TYPES = {
  /** StableSwap pools for pegged assets */
  STABLE: 'stable',
  /** CryptoSwap pools for volatile assets */
  CRYPTO: 'crypto',
  /** Metapools paired with base pools */
  META: 'meta',
  /** Tricrypto pools with 3 volatile assets */
  TRICRYPTO: 'tricrypto',
  /** Lending pools */
  LENDING: 'lending',
} as const;

export type PoolType = (typeof POOL_TYPES)[keyof typeof POOL_TYPES];

/**
 * Default APY thresholds for alerts (in percentage)
 */
export const APY_THRESHOLDS = {
  /** Low APY threshold */
  LOW: 1,
  /** Medium APY threshold */
  MEDIUM: 5,
  /** High APY threshold */
  HIGH: 10,
  /** Very high APY threshold */
  VERY_HIGH: 20,
} as const;

/**
 * TVL thresholds for pool classification (in USD)
 */
export const TVL_THRESHOLDS = {
  /** Minimum TVL for "big" pools */
  BIG_POOL_MIN: 10000,
  /** Minimum TVL for "medium" pools */
  MEDIUM_POOL_MIN: 1000,
  /** Empty pool threshold */
  EMPTY: 0,
} as const;

/**
 * Default volume thresholds for alerts (in USD)
 */
export const VOLUME_THRESHOLDS = {
  /** Low volume threshold */
  LOW: 10000,
  /** Medium volume threshold */
  MEDIUM: 100000,
  /** High volume threshold */
  HIGH: 1000000,
  /** Very high volume threshold */
  VERY_HIGH: 10000000,
} as const;

/**
 * Pool options for n8n UI (common pools)
 */
export const COMMON_POOL_OPTIONS = [
  { name: '3pool (DAI/USDC/USDT)', value: COMMON_POOL_IDS.THREE_POOL },
  { name: 'Tricrypto2 (USDT/WBTC/ETH)', value: COMMON_POOL_IDS.TRICRYPTO2 },
  { name: 'stETH (ETH/stETH)', value: COMMON_POOL_IDS.STETH },
  { name: 'FRAX/USDC', value: COMMON_POOL_IDS.FRAXUSDC },
  { name: 'sUSD Metapool', value: COMMON_POOL_IDS.SUSD },
  { name: 'LUSD Metapool', value: COMMON_POOL_IDS.LUSD },
  { name: 'GUSD Metapool', value: COMMON_POOL_IDS.GUSD },
  { name: 'crvUSD/USDC', value: COMMON_POOL_IDS.CRVUSD_USDC },
  { name: 'crvUSD/USDT', value: COMMON_POOL_IDS.CRVUSD_USDT },
];
