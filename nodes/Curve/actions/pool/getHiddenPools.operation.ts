/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { curveApiRequest } from '../../transport';
import { POOL_ENDPOINTS } from '../../constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    default: '',
    displayOptions: {
      show: {
        resource: ['pool'],
        operation: ['getHiddenPools'],
      },
    },
    // eslint-disable-next-line n8n-nodes-base/node-param-description-unneeded-backticks
    description: 'Returns a list of dysfunctional or deprecated pools that are hidden from the main UI.',
  },
];

export async function execute(
  this: IExecuteFunctions,
  _index: number,
): Promise<IDataObject | IDataObject[]> {
  const hiddenPools = await curveApiRequest.call(this, {
    endpoint: POOL_ENDPOINTS.GET_HIDDEN_POOLS,
  }) as IDataObject[];

  return hiddenPools;
}
