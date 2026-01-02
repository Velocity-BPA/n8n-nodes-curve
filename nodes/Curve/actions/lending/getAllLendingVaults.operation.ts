/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { curveApiRequest } from '../../transport';
import { LENDING_ENDPOINTS } from '../../constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    default: '',
    displayOptions: {
      show: {
        resource: ['lending'],
        operation: ['getAllLendingVaults'],
      },
    },
    // eslint-disable-next-line n8n-nodes-base/node-param-description-unneeded-backticks
    description: 'Returns all lending vaults (LlamaLend) across all supported chains.',
  },
];

export async function execute(
  this: IExecuteFunctions,
  _index: number,
): Promise<IDataObject | IDataObject[]> {
  const vaults = await curveApiRequest.call(this, {
    endpoint: LENDING_ENDPOINTS.GET_ALL_LENDING_VAULTS,
  }) as IDataObject;

  return vaults;
}
