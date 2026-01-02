/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class CurveApi implements ICredentialType {
  name = 'curveApi';

  displayName = 'Curve Finance API';

  documentationUrl = 'https://github.com/Velocity-BPA/n8n-nodes-curve';

  properties: INodeProperties[] = [
    {
      displayName: 'Network',
      name: 'network',
      type: 'options',
      default: 'ethereum',
      description: 'The default blockchain network to use',
      options: [
        { name: 'Ethereum', value: 'ethereum' },
        { name: 'Arbitrum', value: 'arbitrum' },
        { name: 'Aurora', value: 'aurora' },
        { name: 'Avalanche', value: 'avalanche' },
        { name: 'Base', value: 'base' },
        { name: 'BSC (Binance Smart Chain)', value: 'bsc' },
        { name: 'Celo', value: 'celo' },
        { name: 'Fantom', value: 'fantom' },
        { name: 'Fraxtal', value: 'fraxtal' },
        { name: 'Harmony', value: 'harmony' },
        { name: 'Hyperliquid', value: 'hyperliquid' },
        { name: 'Kava', value: 'kava' },
        { name: 'Mantle', value: 'mantle' },
        { name: 'Moonbeam', value: 'moonbeam' },
        { name: 'Optimism', value: 'optimism' },
        { name: 'Polygon', value: 'polygon' },
        { name: 'Sonic', value: 'sonic' },
        { name: 'X-Layer', value: 'x-layer' },
        { name: 'xDai (Gnosis)', value: 'xdai' },
        { name: 'Polygon zkEVM', value: 'zkevm' },
        { name: 'zkSync Era', value: 'zksync' },
      ],
    },
    {
      displayName: 'API Base URL',
      name: 'apiBaseUrl',
      type: 'string',
      default: 'https://api.curve.finance/v1',
      description: 'The base URL for the Curve Finance API',
    },
    {
      displayName: 'Core API URL',
      name: 'coreApiUrl',
      type: 'string',
      default: 'https://api-core.curve.finance/v1',
      description: 'The base URL for the Curve Core API',
    },
  ];
}
