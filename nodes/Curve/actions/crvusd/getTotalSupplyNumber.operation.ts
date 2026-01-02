/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { curveApiRequest } from '../../transport';
import { CRVUSD_ENDPOINTS } from '../../constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    default: '',
    displayOptions: {
      show: {
        resource: ['crvusd'],
        operation: ['getTotalSupplyNumber'],
      },
    },
    // eslint-disable-next-line n8n-nodes-base/node-param-description-unneeded-backticks
    description: 'Returns the total supply of crvUSD as a simple number value.',
  },
];

export async function execute(
  this: IExecuteFunctions,
  _index: number,
): Promise<IDataObject | IDataObject[]> {
  const supply = await curveApiRequest.call(this, {
    endpoint: CRVUSD_ENDPOINTS.GET_TOTAL_SUPPLY_NUMBER,
  }) as IDataObject;

  return supply;
}
