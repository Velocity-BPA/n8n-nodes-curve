/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { curveApiRequest, buildAddressEndpoint, isValidAddress } from '../../transport';
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
        operation: ['getTokenPrice'],
      },
    },
    description: 'The blockchain network to query',
  },
  {
    displayName: 'Token Address',
    name: 'tokenAddress',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['token'],
        operation: ['getTokenPrice'],
      },
    },
    placeholder: '0x...',
    description: 'The token contract address',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const chain = this.getNodeParameter('chain', index) as string;
  const tokenAddress = this.getNodeParameter('tokenAddress', index) as string;

  if (!isValidAddress(tokenAddress)) {
    throw new Error(`Invalid token address: ${tokenAddress}`);
  }

  const endpoint = buildAddressEndpoint(TOKEN_ENDPOINTS.GET_TOKEN_PRICE, chain, tokenAddress);

  const price = await curveApiRequest.call(this, {
    endpoint,
  }) as IDataObject;

  return price;
}
