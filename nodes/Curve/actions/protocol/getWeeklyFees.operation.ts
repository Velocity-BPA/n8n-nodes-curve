/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { curveApiRequest } from '../../transport';
import { PROTOCOL_ENDPOINTS } from '../../constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    default: '',
    displayOptions: {
      show: {
        resource: ['protocol'],
        operation: ['getWeeklyFees'],
      },
    },
    // eslint-disable-next-line n8n-nodes-base/node-param-description-unneeded-backticks
    description: 'Returns the total protocol fees collected over the past week.',
  },
];

export async function execute(
  this: IExecuteFunctions,
  _index: number,
): Promise<IDataObject | IDataObject[]> {
  const fees = await curveApiRequest.call(this, {
    endpoint: PROTOCOL_ENDPOINTS.GET_WEEKLY_FEES,
  }) as IDataObject;

  return fees;
}
