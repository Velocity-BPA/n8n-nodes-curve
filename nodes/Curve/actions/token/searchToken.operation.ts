/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { curveApiRequest, buildAddressEndpoint } from '../../transport';
import { TOKEN_ENDPOINTS, BLOCKCHAIN_OPTIONS } from '../../constants';

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
        resource: ['token'],
        operation: ['searchToken'],
      },
    },
    description: 'The blockchain network to query',
  },
  {
    displayName: 'Search Query',
    name: 'query',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['token'],
        operation: ['searchToken'],
      },
    },
    placeholder: 'e.g., USDC, DAI, or 0x...',
    description: 'Search by token symbol, name, or address',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const chain = this.getNodeParameter('chain', index) as string;
  const query = this.getNodeParameter('query', index) as string;

  const endpoint = buildAddressEndpoint(TOKEN_ENDPOINTS.SEARCH_TOKEN, chain, encodeURIComponent(query));

  const results = await curveApiRequest.call(this, {
    endpoint,
  }) as IDataObject;

  return results;
}
