/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Pool registry type identifiers for Curve Finance
 */
export const REGISTRY_IDS = {
  /** Main curated pools on Ethereum mainnet */
  MAIN: 'main',
  /** Standard factory-deployed pools */
  FACTORY: 'factory',
  /** Crypto pools for volatile asset pairs */
  CRYPTO: 'crypto',
  /** Factory-deployed crypto pools */
  FACTORY_CRYPTO: 'factory-crypto',
  /** Factory pools for crvUSD pairs */
  FACTORY_CRVUSD: 'factory-crvusd',
  /** Factory two-crypto pools */
  FACTORY_TWOCRYPTO: 'factory-twocrypto',
  /** Factory tri-crypto pools */
  FACTORY_TRICRYPTO: 'factory-tricrypto',
  /** Factory EYWA bridge pools */
  FACTORY_EYWA: 'factory-eywa',
  /** Factory stable-ng (new generation) pools */
  FACTORY_STABLE_NG: 'factory-stable-ng',
} as const;

export type RegistryId = (typeof REGISTRY_IDS)[keyof typeof REGISTRY_IDS];

/**
 * Registry options for n8n UI dropdown
 */
export const REGISTRY_OPTIONS = [
  {
    name: 'Main (Curated Ethereum Pools)',
    value: REGISTRY_IDS.MAIN,
    description: 'Curated pools on Ethereum mainnet',
  },
  {
    name: 'Factory',
    value: REGISTRY_IDS.FACTORY,
    description: 'Standard factory-deployed pools',
  },
  {
    name: 'Crypto',
    value: REGISTRY_IDS.CRYPTO,
    description: 'Pools for volatile asset pairs using CryptoSwap',
  },
  {
    name: 'Factory Crypto',
    value: REGISTRY_IDS.FACTORY_CRYPTO,
    description: 'Factory-deployed crypto pools',
  },
  {
    name: 'Factory crvUSD',
    value: REGISTRY_IDS.FACTORY_CRVUSD,
    description: 'Factory pools for crvUSD pairs',
  },
  {
    name: 'Factory Two-Crypto',
    value: REGISTRY_IDS.FACTORY_TWOCRYPTO,
    description: 'Factory two-asset crypto pools',
  },
  {
    name: 'Factory Tri-Crypto',
    value: REGISTRY_IDS.FACTORY_TRICRYPTO,
    description: 'Factory three-asset crypto pools',
  },
  {
    name: 'Factory EYWA',
    value: REGISTRY_IDS.FACTORY_EYWA,
    description: 'Factory EYWA bridge pools',
  },
  {
    name: 'Factory Stable-NG',
    value: REGISTRY_IDS.FACTORY_STABLE_NG,
    description: 'New generation factory stable pools',
  },
];

/**
 * Lending registry identifiers
 */
export const LENDING_REGISTRY_IDS = {
  /** One-way lending markets (standard Curve Lend) */
  ONEWAY: 'oneway',
} as const;

export type LendingRegistryId = (typeof LENDING_REGISTRY_IDS)[keyof typeof LENDING_REGISTRY_IDS];

/**
 * Lending registry options for n8n UI dropdown
 */
export const LENDING_REGISTRY_OPTIONS = [
  {
    name: 'One-Way Lending',
    value: LENDING_REGISTRY_IDS.ONEWAY,
    description: 'Standard one-way lending markets (Curve Lend / LlamaLend)',
  },
];

/**
 * Registry metadata with descriptions
 */
export const REGISTRY_METADATA: Record<
  RegistryId,
  {
    name: string;
    description: string;
    poolType: 'stable' | 'crypto' | 'mixed';
  }
> = {
  [REGISTRY_IDS.MAIN]: {
    name: 'Main Registry',
    description: 'Curated StableSwap pools on Ethereum mainnet',
    poolType: 'stable',
  },
  [REGISTRY_IDS.FACTORY]: {
    name: 'Factory Registry',
    description: 'Permissionlessly deployed StableSwap pools',
    poolType: 'stable',
  },
  [REGISTRY_IDS.CRYPTO]: {
    name: 'Crypto Registry',
    description: 'CryptoSwap pools for volatile assets',
    poolType: 'crypto',
  },
  [REGISTRY_IDS.FACTORY_CRYPTO]: {
    name: 'Factory Crypto Registry',
    description: 'Permissionlessly deployed CryptoSwap pools',
    poolType: 'crypto',
  },
  [REGISTRY_IDS.FACTORY_CRVUSD]: {
    name: 'Factory crvUSD Registry',
    description: 'Factory pools paired with crvUSD stablecoin',
    poolType: 'mixed',
  },
  [REGISTRY_IDS.FACTORY_TWOCRYPTO]: {
    name: 'Factory Two-Crypto Registry',
    description: 'Factory pools with two volatile assets',
    poolType: 'crypto',
  },
  [REGISTRY_IDS.FACTORY_TRICRYPTO]: {
    name: 'Factory Tri-Crypto Registry',
    description: 'Factory pools with three volatile assets',
    poolType: 'crypto',
  },
  [REGISTRY_IDS.FACTORY_EYWA]: {
    name: 'Factory EYWA Registry',
    description: 'Factory pools for EYWA cross-chain bridge assets',
    poolType: 'stable',
  },
  [REGISTRY_IDS.FACTORY_STABLE_NG]: {
    name: 'Factory Stable-NG Registry',
    description: 'New generation factory stable pools with improved mechanics',
    poolType: 'stable',
  },
};
