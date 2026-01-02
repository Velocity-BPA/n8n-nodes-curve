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
        operation: ['getPoolsByRegistry'],
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
        operation: ['getPoolsByRegistry'],
      },
    },
    description: 'The pool registry to query',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const chain = this.getNodeParameter('chain', index) as string;
  const registry = this.getNodeParameter('registry', index) as string;

  const endpoint = buildRegistryEndpoint(POOL_ENDPOINTS.GET_POOLS_BY_REGISTRY, chain, registry);

  const pools = (await curveApiRequest.call(this, {
    endpoint,
  })) as IDataObject[];

  return pools;
}
