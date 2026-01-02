/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { curveApiRequest, buildRegistryEndpoint } from '../../transport';
import { POOL_ENDPOINTS, BLOCKCHAIN_OPTIONS, REGISTRY_OPTIONS } from '../../constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Chain',
    name: 'chain',
    type: 'options',
    options: BLOCKCHAIN_OPTIONS,
    default: 'ethereum',
    required: true,
    displayOptions: {
      show: {
        resource: ['pool'],
        operation: ['getPool'],
      },
    },
    description: 'The blockchain network to query',
  },
  {
    displayName: 'Registry',
    name: 'registry',
    type: 'options',
    options: REGISTRY_OPTIONS,
    default: 'main',
    required: true,
    displayOptions: {
      show: {
        resource: ['pool'],
        operation: ['getPool'],
      },
    },
    description: 'The pool registry to query',
  },
  {
    displayName: 'Pool ID',
    name: 'poolId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['pool'],
        operation: ['getPool'],
      },
    },
    placeholder: 'e.g., 3pool, factory-v2-11, tricrypto2',
    description: 'The unique identifier of the pool',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const chain = this.getNodeParameter('chain', index) as string;
  const registry = this.getNodeParameter('registry', index) as string;
  const poolId = this.getNodeParameter('poolId', index) as string;

  const endpoint = buildRegistryEndpoint(POOL_ENDPOINTS.GET_POOLS_BY_REGISTRY, chain, registry);

  const pools = await curveApiRequest.call(this, {
    endpoint,
  }) as IDataObject[];

  // Find the specific pool by ID
  const pool = pools.find(
    (p: IDataObject) => p.id === poolId || p.address === poolId || p.name === poolId,
  );

  if (!pool) {
    throw new Error(`Pool "${poolId}" not found in ${registry} registry on ${chain}`);
  }

  return pool;
}
