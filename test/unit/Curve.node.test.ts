/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Curve } from '../../nodes/Curve/Curve.node';
import { CurveTrigger } from '../../nodes/Curve/CurveTrigger.node';

describe('Curve Node', () => {
  let curveNode: Curve;

  beforeEach(() => {
    curveNode = new Curve();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(curveNode.description.displayName).toBe('Curve Finance');
    });

    it('should have correct name', () => {
      expect(curveNode.description.name).toBe('curve');
    });

    it('should have correct icon', () => {
      expect(curveNode.description.icon).toBe('file:curve.svg');
    });

    it('should have correct version', () => {
      expect(curveNode.description.version).toBe(1);
    });

    it('should have correct group', () => {
      expect(curveNode.description.group).toContain('transform');
    });

    it('should require curveApi credentials', () => {
      const credentials = curveNode.description.credentials;
      expect(credentials).toBeDefined();
      expect(credentials).toHaveLength(1);
      expect(credentials![0].name).toBe('curveApi');
      expect(credentials![0].required).toBe(true);
    });
  });

  describe('Resources', () => {
    it('should have 7 resource options', () => {
      const resourceProperty = curveNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      expect(resourceProperty).toBeDefined();
      expect(resourceProperty!.type).toBe('options');
      expect((resourceProperty as { options: unknown[] }).options).toHaveLength(7);
    });

    it('should have pool resource', () => {
      const resourceProperty = curveNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const options = (resourceProperty as { options: Array<{ value: string }> }).options;
      expect(options.some((o) => o.value === 'pool')).toBe(true);
    });

    it('should have volume resource', () => {
      const resourceProperty = curveNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const options = (resourceProperty as { options: Array<{ value: string }> }).options;
      expect(options.some((o) => o.value === 'volume')).toBe(true);
    });

    it('should have gauge resource', () => {
      const resourceProperty = curveNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const options = (resourceProperty as { options: Array<{ value: string }> }).options;
      expect(options.some((o) => o.value === 'gauge')).toBe(true);
    });

    it('should have lending resource', () => {
      const resourceProperty = curveNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const options = (resourceProperty as { options: Array<{ value: string }> }).options;
      expect(options.some((o) => o.value === 'lending')).toBe(true);
    });

    it('should have crvusd resource', () => {
      const resourceProperty = curveNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const options = (resourceProperty as { options: Array<{ value: string }> }).options;
      expect(options.some((o) => o.value === 'crvusd')).toBe(true);
    });

    it('should have token resource', () => {
      const resourceProperty = curveNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const options = (resourceProperty as { options: Array<{ value: string }> }).options;
      expect(options.some((o) => o.value === 'token')).toBe(true);
    });

    it('should have protocol resource', () => {
      const resourceProperty = curveNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const options = (resourceProperty as { options: Array<{ value: string }> }).options;
      expect(options.some((o) => o.value === 'protocol')).toBe(true);
    });
  });

  describe('Pool Operations', () => {
    it('should have pool operations property', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('pool')
      );
      expect(operationProperty).toBeDefined();
    });

    it('should have 9 pool operations', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('pool')
      );
      const options = (operationProperty as { options: unknown[] }).options;
      expect(options).toHaveLength(9);
    });
  });

  describe('Volume Operations', () => {
    it('should have volume operations property', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('volume')
      );
      expect(operationProperty).toBeDefined();
    });

    it('should have 6 volume operations', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('volume')
      );
      const options = (operationProperty as { options: unknown[] }).options;
      expect(options).toHaveLength(6);
    });
  });

  describe('Gauge Operations', () => {
    it('should have gauge operations property', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('gauge')
      );
      expect(operationProperty).toBeDefined();
    });

    it('should have 4 gauge operations', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('gauge')
      );
      const options = (operationProperty as { options: unknown[] }).options;
      expect(options).toHaveLength(4);
    });
  });

  describe('Lending Operations', () => {
    it('should have lending operations property', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('lending')
      );
      expect(operationProperty).toBeDefined();
    });

    it('should have 5 lending operations', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('lending')
      );
      const options = (operationProperty as { options: unknown[] }).options;
      expect(options).toHaveLength(5);
    });
  });

  describe('crvUSD Operations', () => {
    it('should have crvusd operations property', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('crvusd')
      );
      expect(operationProperty).toBeDefined();
    });

    it('should have 5 crvusd operations', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('crvusd')
      );
      const options = (operationProperty as { options: unknown[] }).options;
      expect(options).toHaveLength(5);
    });
  });

  describe('Token Operations', () => {
    it('should have token operations property', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('token')
      );
      expect(operationProperty).toBeDefined();
    });

    it('should have 3 token operations', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('token')
      );
      const options = (operationProperty as { options: unknown[] }).options;
      expect(options).toHaveLength(3);
    });
  });

  describe('Protocol Operations', () => {
    it('should have protocol operations property', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('protocol')
      );
      expect(operationProperty).toBeDefined();
    });

    it('should have 5 protocol operations', () => {
      const operationProperty = curveNode.description.properties.find(
        (p) => p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('protocol')
      );
      const options = (operationProperty as { options: unknown[] }).options;
      expect(options).toHaveLength(5);
    });
  });
});

describe('CurveTrigger Node', () => {
  let triggerNode: CurveTrigger;

  beforeEach(() => {
    triggerNode = new CurveTrigger();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(triggerNode.description.displayName).toBe('Curve Finance Trigger');
    });

    it('should have correct name', () => {
      expect(triggerNode.description.name).toBe('curveTrigger');
    });

    it('should have correct icon', () => {
      expect(triggerNode.description.icon).toBe('file:curve.svg');
    });

    it('should be a polling trigger', () => {
      expect(triggerNode.description.polling).toBe(true);
    });

    it('should have trigger group', () => {
      expect(triggerNode.description.group).toContain('trigger');
    });

    it('should require curveApi credentials', () => {
      const credentials = triggerNode.description.credentials;
      expect(credentials).toBeDefined();
      expect(credentials).toHaveLength(1);
      expect(credentials![0].name).toBe('curveApi');
      expect(credentials![0].required).toBe(true);
    });
  });

  describe('Trigger Types', () => {
    it('should have triggerType property', () => {
      const triggerTypeProperty = triggerNode.description.properties.find(
        (p) => p.name === 'triggerType'
      );
      expect(triggerTypeProperty).toBeDefined();
    });

    it('should have 10 trigger types', () => {
      const triggerTypeProperty = triggerNode.description.properties.find(
        (p) => p.name === 'triggerType'
      );
      const options = (triggerTypeProperty as { options: unknown[] }).options;
      expect(options).toHaveLength(10);
    });

    it('should include poolTvlChanged trigger', () => {
      const triggerTypeProperty = triggerNode.description.properties.find(
        (p) => p.name === 'triggerType'
      );
      const options = (triggerTypeProperty as { options: Array<{ value: string }> }).options;
      expect(options.some((o) => o.value === 'poolTvlChanged')).toBe(true);
    });

    it('should include newPoolCreated trigger', () => {
      const triggerTypeProperty = triggerNode.description.properties.find(
        (p) => p.name === 'triggerType'
      );
      const options = (triggerTypeProperty as { options: Array<{ value: string }> }).options;
      expect(options.some((o) => o.value === 'newPoolCreated')).toBe(true);
    });

    it('should include crvusdSupplyChanged trigger', () => {
      const triggerTypeProperty = triggerNode.description.properties.find(
        (p) => p.name === 'triggerType'
      );
      const options = (triggerTypeProperty as { options: Array<{ value: string }> }).options;
      expect(options.some((o) => o.value === 'crvusdSupplyChanged')).toBe(true);
    });

    it('should include lendingUtilizationAlert trigger', () => {
      const triggerTypeProperty = triggerNode.description.properties.find(
        (p) => p.name === 'triggerType'
      );
      const options = (triggerTypeProperty as { options: Array<{ value: string }> }).options;
      expect(options.some((o) => o.value === 'lendingUtilizationAlert')).toBe(true);
    });
  });
});
