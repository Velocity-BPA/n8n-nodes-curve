/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { curveApiRequest, buildRegistryEndpoint } from '../../transport';
import { LENDING_ENDPOINTS, LENDING_CHAIN_OPTIONS, LENDING_REGISTRY_OPTIONS } from '../../constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Chain',
    name: 'chain',
    type: 'options',
    options: LENDING_CHAIN_OPTIONS,
    default: 'ethereum',
    required: true,
    displayOptions: {
      show: {
        resource: ['lending'],
        operation: ['getLendingVaults'],
      },
    },
    description: 'The blockchain network to query (only chains supporting Curve Lending)',
  },
  {
    displayName: 'Registry',
    name: 'registry',
    type: 'options',
    options: LENDING_REGISTRY_OPTIONS,
    default: 'oneway',
    required: true,
    displayOptions: {
      show: {
        resource: ['lending'],
        operation: ['getLendingVaults'],
      },
    },
    description: 'The lending registry type',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const chain = this.getNodeParameter('chain', index) as string;
  const registry = this.getNodeParameter('registry', index) as string;

  const endpoint = buildRegistryEndpoint(LENDING_ENDPOINTS.GET_LENDING_VAULTS, chain, registry);

  const vaults = await curveApiRequest.call(this, {
    endpoint,
  }) as IDataObject;

  return vaults;
}
