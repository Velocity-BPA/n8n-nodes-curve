/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Default API base URLs
 */
export const API_BASE_URLS = {
  /** Main Curve Finance API */
  MAIN: 'https://api.curve.finance/v1',
  /** Core API for additional endpoints */
  CORE: 'https://api-core.curve.finance/v1',
} as const;

/**
 * Pool-related API endpoints
 */
export const POOL_ENDPOINTS = {
  /** Get pools by chain and registry: /getPools/{blockchainId}/{registryId} */
  GET_POOLS_BY_REGISTRY: '/getPools',
  /** Get all pools on a chain: /getPools/all/{blockchainId} */
  GET_ALL_POOLS: '/getPools/all',
  /** Get all pools globally: /getPools/all */
  GET_ALL_POOLS_GLOBAL: '/getPools/all',
  /** Get big pools (TVL >= $10k): /getPools/big/{blockchainId} */
  GET_BIG_POOLS: '/getPools/big',
  /** Get small pools (TVL < $10k): /getPools/small/{blockchainId} */
  GET_SMALL_POOLS: '/getPools/small',
  /** Get empty pools ($0 TVL): /getPools/empty/{blockchainId} */
  GET_EMPTY_POOLS: '/getPools/empty',
  /** Get pool list (addresses): /getPoolList/{blockchainId} */
  GET_POOL_LIST: '/getPoolList',
  /** Get hidden/dysfunctional pools: /getHiddenPools */
  GET_HIDDEN_POOLS: '/getHiddenPools',
} as const;

/**
 * Volume and APY API endpoints
 */
export const VOLUME_ENDPOINTS = {
  /** Get pool volumes and base APY: /getVolumes/{blockchainId} */
  GET_VOLUMES: '/getVolumes',
  /** Get total volume for chain: /getTotalVolume/{blockchainId} */
  GET_TOTAL_VOLUME: '/getTotalVolume',
  /** Get base APYs: /getBaseApys/{blockchainId} */
  GET_BASE_APYS: '/getBaseApys',
  /** Get subgraph data: /getSubgraphData/{blockchainId} */
  GET_SUBGRAPH_DATA: '/getSubgraphData',
  /** Get factory APYs: /getFactoryAPYs/{blockchainId} */
  GET_FACTORY_APYS: '/getFactoryAPYs',
  /** Get factory gauge CRV rewards: /getFactoryGaugeCrvRewards/{blockchainId} */
  GET_FACTORY_GAUGE_CRV_REWARDS: '/getFactoryGaugeCrvRewards',
} as const;

/**
 * Gauge API endpoints
 */
export const GAUGE_ENDPOINTS = {
  /** Get all gauges globally: /getAllGauges */
  GET_ALL_GAUGES: '/getAllGauges',
  /** Get factory gauges by chain: /getFactoryGauges/{blockchainId} */
  GET_FACTORY_GAUGES: '/getFactoryGauges',
  /** Get gauge CRV rewards: /getGauges/{blockchainId}/getRewards */
  GET_GAUGE_CRV_REWARDS: '/getGauges',
  /** Get main pool gauge rewards: /getMainPoolsGaugeRewards */
  GET_MAIN_POOL_GAUGE_REWARDS: '/getMainPoolsGaugeRewards',
} as const;

/**
 * Lending API endpoints (Curve Lend / LlamaLend)
 */
export const LENDING_ENDPOINTS = {
  /** Get lending vaults by chain and registry: /getLendingVaults/{blockchainId}/{registryId} */
  GET_LENDING_VAULTS: '/getLendingVaults',
  /** Get all lending vaults by chain: /getLendingVaults/all/{blockchainId} */
  GET_ALL_LENDING_VAULTS_BY_CHAIN: '/getLendingVaults/all',
  /** Get all lending vaults globally: /getLendingVaults/all */
  GET_ALL_LENDING_VAULTS: '/getLendingVaults/all',
  /** Get vault details: /getLendingVaultDetails/{blockchainId}/{vaultAddress} */
  GET_VAULT_DETAILS: '/getLendingVaultDetails',
  /** Get lending markets: /getLendingMarkets */
  GET_LENDING_MARKETS: '/getLendingMarkets',
} as const;

/**
 * crvUSD API endpoints
 */
export const CRVUSD_ENDPOINTS = {
  /** Get crvUSD total supply: /getCrvusdTotalSupply */
  GET_TOTAL_SUPPLY: '/getCrvusdTotalSupply',
  /** Get crvUSD circulating supply: /getCrvusdCirculatingSupply */
  GET_CIRCULATING_SUPPLY: '/getCrvusdCirculatingSupply',
  /** Get crvUSD total supply as number: /getCrvusdTotalSupplyNumber */
  GET_TOTAL_SUPPLY_NUMBER: '/getCrvusdTotalSupplyNumber',
  /** Get scrvUSD total supply: /getScrvusdTotalSupplyNumber */
  GET_SCRVUSD_SUPPLY: '/getScrvusdTotalSupplyNumber',
  /** Get crvUSD AMM volumes: /getCrvusdAmmVolumes */
  GET_AMM_VOLUMES: '/getCrvusdAmmVolumes',
} as const;

/**
 * Token API endpoints
 */
export const TOKEN_ENDPOINTS = {
  /** Get all tokens on chain: /getTokens/all/{blockchainId} */
  GET_ALL_TOKENS: '/getTokens/all',
  /** Get token price: /getTokenPrice/{blockchainId}/{tokenAddress} */
  GET_TOKEN_PRICE: '/getTokenPrice',
  /** Search token: /searchToken/{blockchainId}/{query} */
  SEARCH_TOKEN: '/searchToken',
} as const;

/**
 * Protocol API endpoints
 */
export const PROTOCOL_ENDPOINTS = {
  /** Get supported platforms: /getPlatforms */
  GET_PLATFORMS: '/getPlatforms',
  /** Get registry address: /getRegistryAddress */
  GET_REGISTRY_ADDRESS: '/getRegistryAddress',
  /** Get gas price: /getGasPrice */
  GET_GAS_PRICE: '/getGasPrice',
  /** Get weekly fees: /getWeeklyFees */
  GET_WEEKLY_FEES: '/getWeeklyFees',
  /** Get points campaigns: /getPointsCampaigns */
  GET_POINTS_CAMPAIGNS: '/getPointsCampaigns',
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  /** Maximum requests per second */
  MAX_REQUESTS_PER_SECOND: 10,
  /** Retry delay in milliseconds */
  RETRY_DELAY_MS: 1000,
  /** Maximum retries */
  MAX_RETRIES: 3,
  /** Backoff multiplier */
  BACKOFF_MULTIPLIER: 2,
} as const;

/**
 * Default timeout in milliseconds
 */
export const DEFAULT_TIMEOUT_MS = 30000;
