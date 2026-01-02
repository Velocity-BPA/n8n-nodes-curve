/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { curveApiRequest, buildChainEndpoint } from '../../transport';
import { VOLUME_ENDPOINTS, BLOCKCHAIN_OPTIONS } from '../../constants';

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
        resource: ['volume'],
        operation: ['getFactoryApys'],
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

  const endpoint = buildChainEndpoint(VOLUME_ENDPOINTS.GET_FACTORY_APYS, chain);

  const factoryApys = await curveApiRequest.call(this, {
    endpoint,
  }) as IDataObject;

  return factoryApys;
}
