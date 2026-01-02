/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 */

import {
  buildChainEndpoint,
  buildRegistryEndpoint,
  buildAddressEndpoint,
  isValidAddress,
  formatLargeNumber,
  parsePercentage,
} from '../../nodes/Curve/transport';

describe('Transport Utils', () => {
  describe('buildChainEndpoint', () => {
    it('should build endpoint with chain ID', () => {
      const result = buildChainEndpoint('/getPools/all', 'ethereum');
      expect(result).toBe('/getPools/all/ethereum');
    });

    it('should work with different chains', () => {
      const result = buildChainEndpoint('/getVolumes', 'arbitrum');
      expect(result).toBe('/getVolumes/arbitrum');
    });
  });

  describe('buildRegistryEndpoint', () => {
    it('should build endpoint with chain and registry', () => {
      const result = buildRegistryEndpoint('/getPools', 'ethereum', 'main');
      expect(result).toBe('/getPools/ethereum/main');
    });

    it('should work with factory registry', () => {
      const result = buildRegistryEndpoint('/getPools', 'polygon', 'factory');
      expect(result).toBe('/getPools/polygon/factory');
    });
  });

  describe('buildAddressEndpoint', () => {
    it('should build endpoint with chain and address', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const result = buildAddressEndpoint('/getPool', 'ethereum', address);
      expect(result).toBe(`/getPool/ethereum/${address}`);
    });
  });

  describe('isValidAddress', () => {
    it('should return true for valid Ethereum address', () => {
      expect(isValidAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true);
    });

    it('should return true for uppercase address', () => {
      expect(isValidAddress('0x1234567890ABCDEF1234567890ABCDEF12345678')).toBe(true);
    });

    it('should return false for address without 0x prefix', () => {
      expect(isValidAddress('1234567890abcdef1234567890abcdef12345678')).toBe(false);
    });

    it('should return false for address with wrong length', () => {
      expect(isValidAddress('0x1234567890abcdef')).toBe(false);
    });

    it('should return false for address with invalid characters', () => {
      expect(isValidAddress('0x1234567890ghijkl1234567890ghijkl12345678')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidAddress('')).toBe(false);
    });
  });

  describe('formatLargeNumber', () => {
    it('should format billions', () => {
      expect(formatLargeNumber(1500000000)).toBe('1.50B');
    });

    it('should format millions', () => {
      expect(formatLargeNumber(1500000)).toBe('1.50M');
    });

    it('should format thousands', () => {
      expect(formatLargeNumber(1500)).toBe('1.50K');
    });

    it('should format small numbers', () => {
      expect(formatLargeNumber(150)).toBe('150.00');
    });

    it('should handle string input', () => {
      expect(formatLargeNumber('1500000')).toBe('1.50M');
    });

    it('should handle NaN', () => {
      expect(formatLargeNumber('invalid')).toBe('0');
    });
  });

  describe('parsePercentage', () => {
    it('should return number as is', () => {
      expect(parsePercentage(5.5)).toBe(5.5);
    });

    it('should parse percentage string', () => {
      expect(parsePercentage('5.5%')).toBe(5.5);
    });

    it('should parse percentage without symbol', () => {
      expect(parsePercentage('5.5')).toBe(5.5);
    });

    it('should handle whitespace', () => {
      expect(parsePercentage(' 5.5% ')).toBe(5.5);
    });

    it('should return 0 for invalid string', () => {
      expect(parsePercentage('invalid')).toBe(0);
    });
  });
});
