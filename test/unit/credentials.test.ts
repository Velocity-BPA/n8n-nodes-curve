/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 */

import { CurveApi } from '../../credentials/CurveApi.credentials';

describe('CurveApi Credentials', () => {
  let credentials: CurveApi;

  beforeEach(() => {
    credentials = new CurveApi();
  });

  describe('Basic Properties', () => {
    it('should have correct name', () => {
      expect(credentials.name).toBe('curveApi');
    });

    it('should have correct displayName', () => {
      expect(credentials.displayName).toBe('Curve Finance API');
    });

    it('should have documentation URL', () => {
      expect(credentials.documentationUrl).toBeDefined();
    });
  });

  describe('Properties Configuration', () => {
    it('should have network property', () => {
      const networkProp = credentials.properties.find(p => p.name === 'network');
      expect(networkProp).toBeDefined();
      expect(networkProp?.type).toBe('options');
      expect(networkProp?.default).toBe('ethereum');
    });

    it('should have apiBaseUrl property', () => {
      const apiBaseProp = credentials.properties.find(p => p.name === 'apiBaseUrl');
      expect(apiBaseProp).toBeDefined();
      expect(apiBaseProp?.type).toBe('string');
      expect(apiBaseProp?.default).toBe('https://api.curve.finance/v1');
    });

    it('should have coreApiUrl property', () => {
      const coreApiProp = credentials.properties.find(p => p.name === 'coreApiUrl');
      expect(coreApiProp).toBeDefined();
      expect(coreApiProp?.type).toBe('string');
      expect(coreApiProp?.default).toBe('https://api-core.curve.finance/v1');
    });

    it('should have multiple network options', () => {
      const networkProp = credentials.properties.find(p => p.name === 'network');
      expect(networkProp?.options).toBeDefined();
      expect(Array.isArray(networkProp?.options)).toBe(true);
      if (networkProp?.options) {
        expect(networkProp.options.length).toBeGreaterThan(10);
      }
    });
  });

  describe('Network Options', () => {
    it('should include Ethereum network', () => {
      const networkProp = credentials.properties.find(p => p.name === 'network');
      const ethereumOption = (networkProp?.options as Array<{ value: string }>)?.find(
        o => o.value === 'ethereum'
      );
      expect(ethereumOption).toBeDefined();
    });

    it('should include Arbitrum network', () => {
      const networkProp = credentials.properties.find(p => p.name === 'network');
      const arbitrumOption = (networkProp?.options as Array<{ value: string }>)?.find(
        o => o.value === 'arbitrum'
      );
      expect(arbitrumOption).toBeDefined();
    });

    it('should include Polygon network', () => {
      const networkProp = credentials.properties.find(p => p.name === 'network');
      const polygonOption = (networkProp?.options as Array<{ value: string }>)?.find(
        o => o.value === 'polygon'
      );
      expect(polygonOption).toBeDefined();
    });
  });
});
