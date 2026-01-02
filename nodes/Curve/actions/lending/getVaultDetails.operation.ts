/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { curveApiRequest, buildAddressEndpoint, isValidAddress } from '../../transport';
import { LENDING_ENDPOINTS, LENDING_CHAIN_OPTIONS } from '../../constants';

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
        operation: ['getVaultDetails'],
      },
    },
    description: 'The blockchain network to query',
  },
  {
    displayName: 'Vault Address',
    name: 'vaultAddress',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['lending'],
        operation: ['getVaultDetails'],
      },
    },
    placeholder: '0x...',
    description: 'The vault contract address',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const chain = this.getNodeParameter('chain', index) as string;
  const vaultAddress = this.getNodeParameter('vaultAddress', index) as string;

  if (!isValidAddress(vaultAddress)) {
    throw new Error(`Invalid vault address: ${vaultAddress}`);
  }

  const endpoint = buildAddressEndpoint(LENDING_ENDPOINTS.GET_VAULT_DETAILS, chain, vaultAddress);

  const details = await curveApiRequest.call(this, {
    endpoint,
  }) as IDataObject;

  return details;
}
