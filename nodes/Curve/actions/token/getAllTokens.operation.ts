/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { curveApiRequest, buildChainEndpoint } from '../../transport';
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
        operation: ['getAllTokens'],
      },
    },
    description: 'The blockchain network to query',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const chain = this.getNodeParameter('chain', index) as string;

  const endpoint = buildChainEndpoint(TOKEN_ENDPOINTS.GET_ALL_TOKENS, chain);

  const tokens = await curveApiRequest.call(this, {
    endpoint,
  }) as IDataObject;

  return tokens;
}
