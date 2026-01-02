/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 */

import {
  BLOCKCHAIN_IDS,
  CHAIN_METADATA,
  LENDING_SUPPORTED_CHAINS,
  BLOCKCHAIN_OPTIONS,
} from '../../nodes/Curve/constants/chains';
import { REGISTRY_IDS, REGISTRY_OPTIONS, LENDING_REGISTRY_IDS } from '../../nodes/Curve/constants/registries';
import { COMMON_POOL_IDS, GAUGE_CONTROLLER_ADDRESSES, CRVUSD_ADDRESSES } from '../../nodes/Curve/constants/pools';
import {
  API_BASE_URLS,
  POOL_ENDPOINTS,
  VOLUME_ENDPOINTS,
  RATE_LIMITS,
} from '../../nodes/Curve/constants/endpoints';

describe('Curve Constants', () => {
  describe('Blockchain IDs', () => {
    it('should have all expected chain IDs', () => {
      expect(BLOCKCHAIN_IDS.ETHEREUM).toBe('ethereum');
      expect(BLOCKCHAIN_IDS.ARBITRUM).toBe('arbitrum');
      expect(BLOCKCHAIN_IDS.OPTIMISM).toBe('optimism');
      expect(BLOCKCHAIN_IDS.POLYGON).toBe('polygon');
      expect(BLOCKCHAIN_IDS.BASE).toBe('base');
    });

    it('should have 21 blockchain IDs', () => {
      const chainCount = Object.keys(BLOCKCHAIN_IDS).length;
      expect(chainCount).toBe(21);
    });

    it('should have blockchain options for UI dropdown', () => {
      expect(BLOCKCHAIN_OPTIONS.length).toBeGreaterThan(0);
      expect(BLOCKCHAIN_OPTIONS[0]).toHaveProperty('name');
      expect(BLOCKCHAIN_OPTIONS[0]).toHaveProperty('value');
    });
  });

  describe('Chain Metadata', () => {
    it('should have metadata for each chain ID', () => {
      Object.values(BLOCKCHAIN_IDS).forEach((chainId) => {
        expect(CHAIN_METADATA[chainId]).toBeDefined();
      });
    });

    it('should have complete metadata structure', () => {
      Object.values(BLOCKCHAIN_IDS).forEach((chainId) => {
        expect(CHAIN_METADATA[chainId].name).toBeDefined();
        expect(typeof CHAIN_METADATA[chainId].name).toBe('string');
      });
    });

    it('should have numeric chain IDs', () => {
      Object.values(BLOCKCHAIN_IDS).forEach((chainId) => {
        expect(CHAIN_METADATA[chainId].chainId).toBeDefined();
        expect(typeof CHAIN_METADATA[chainId].chainId).toBe('number');
      });
    });
  });

  describe('Lending Supported Chains', () => {
    it('should include Ethereum', () => {
      expect(LENDING_SUPPORTED_CHAINS).toContain('ethereum');
    });

    it('should include Arbitrum', () => {
      expect(LENDING_SUPPORTED_CHAINS).toContain('arbitrum');
    });

    it('should have limited chain support', () => {
      expect(LENDING_SUPPORTED_CHAINS.length).toBeLessThan(
        Object.keys(BLOCKCHAIN_IDS).length,
      );
    });
  });

  describe('Registry IDs', () => {
    it('should have main registry', () => {
      expect(REGISTRY_IDS.MAIN).toBe('main');
    });

    it('should have factory registry', () => {
      expect(REGISTRY_IDS.FACTORY).toBe('factory');
    });

    it('should have crypto registry', () => {
      expect(REGISTRY_IDS.CRYPTO).toBe('crypto');
    });

    it('should have registry options for UI dropdown', () => {
      expect(REGISTRY_OPTIONS.length).toBeGreaterThan(0);
      expect(REGISTRY_OPTIONS[0]).toHaveProperty('name');
      expect(REGISTRY_OPTIONS[0]).toHaveProperty('value');
    });
  });

  describe('Lending Registry IDs', () => {
    it('should have oneway lending registry', () => {
      expect(LENDING_REGISTRY_IDS.ONEWAY).toBe('oneway');
    });
  });

  describe('Common Pool IDs', () => {
    it('should have 3pool', () => {
      expect(COMMON_POOL_IDS.THREE_POOL).toBe('3pool');
    });

    it('should have tricrypto2', () => {
      expect(COMMON_POOL_IDS.TRICRYPTO2).toBe('tricrypto2');
    });

    it('should have steth', () => {
      expect(COMMON_POOL_IDS.STETH).toBe('steth');
    });
  });

  describe('Contract Addresses', () => {
    it('should have gauge controller address for Ethereum', () => {
      expect(GAUGE_CONTROLLER_ADDRESSES.ethereum).toBeDefined();
      expect(GAUGE_CONTROLLER_ADDRESSES.ethereum).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should have crvUSD address for Ethereum', () => {
      expect(CRVUSD_ADDRESSES.ethereum).toBeDefined();
      expect(CRVUSD_ADDRESSES.ethereum).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe('API Configuration', () => {
    it('should have main API base URL', () => {
      expect(API_BASE_URLS.MAIN).toBe('https://api.curve.finance/v1');
    });

    it('should have core API base URL', () => {
      expect(API_BASE_URLS.CORE).toBe('https://api-core.curve.finance/v1');
    });
  });

  describe('Pool Endpoints', () => {
    it('should have get pools by registry endpoint', () => {
      expect(POOL_ENDPOINTS.GET_POOLS_BY_REGISTRY).toBe('/getPools');
    });

    it('should have get all pools endpoint', () => {
      expect(POOL_ENDPOINTS.GET_ALL_POOLS).toBe('/getPools/all');
    });

    it('should have get big pools endpoint', () => {
      expect(POOL_ENDPOINTS.GET_BIG_POOLS).toBe('/getPools/big');
    });
  });

  describe('Volume Endpoints', () => {
    it('should have get volumes endpoint', () => {
      expect(VOLUME_ENDPOINTS.GET_VOLUMES).toBe('/getVolumes');
    });

    it('should have get base APYs endpoint', () => {
      expect(VOLUME_ENDPOINTS.GET_BASE_APYS).toBe('/getBaseApys');
    });
  });

  describe('Rate Limits', () => {
    it('should have requests per second limit', () => {
      expect(RATE_LIMITS.MAX_REQUESTS_PER_SECOND).toBeDefined();
      expect(typeof RATE_LIMITS.MAX_REQUESTS_PER_SECOND).toBe('number');
    });

    it('should have max retries', () => {
      expect(RATE_LIMITS.MAX_RETRIES).toBeDefined();
      expect(typeof RATE_LIMITS.MAX_RETRIES).toBe('number');
    });

    it('should have retry delay', () => {
      expect(RATE_LIMITS.RETRY_DELAY_MS).toBeDefined();
      expect(typeof RATE_LIMITS.RETRY_DELAY_MS).toBe('number');
    });
  });
});
