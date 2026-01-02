/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import * as pool from './actions/pool';
import * as volume from './actions/volume';
import * as gauge from './actions/gauge';
import * as lending from './actions/lending';
import * as crvusd from './actions/crvusd';
import * as token from './actions/token';
import * as protocol from './actions/protocol';

// Log licensing notice once on module load
const LICENSING_LOGGED = Symbol.for('n8n-nodes-curve.licensing.logged');
if (!(globalThis as Record<symbol, boolean>)[LICENSING_LOGGED]) {
  console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
  (globalThis as Record<symbol, boolean>)[LICENSING_LOGGED] = true;
}

export class Curve implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Curve Finance',
    name: 'curve',
    icon: 'file:curve.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Curve Finance DEX - pools, gauges, crvUSD, and lending across 21+ chains',
    defaults: {
      name: 'Curve Finance',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'curveApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Pool',
            value: 'pool',
            description: 'Liquidity pool operations',
          },
          {
            name: 'Volume & APY',
            value: 'volume',
            description: 'Trading volume and APY data',
          },
          {
            name: 'Gauge',
            value: 'gauge',
            description: 'Gauge and CRV reward operations',
          },
          {
            name: 'Lending',
            value: 'lending',
            description: 'Curve Lend / LlamaLend operations',
          },
          {
            name: 'crvUSD',
            value: 'crvusd',
            description: 'crvUSD stablecoin operations',
          },
          {
            name: 'Token',
            value: 'token',
            description: 'Token information and pricing',
          },
          {
            name: 'Protocol',
            value: 'protocol',
            description: 'Protocol-wide information',
          },
        ],
        default: 'pool',
      },
      // Pool operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['pool'],
          },
        },
        options: [
          {
            name: 'Get Pool',
            value: 'getPool',
            description: 'Get details for a specific pool',
            action: 'Get pool details',
          },
          {
            name: 'Get Pools by Registry',
            value: 'getPoolsByRegistry',
            description: 'Get all pools in a specific registry',
            action: 'Get pools by registry',
          },
          {
            name: 'Get All Pools',
            value: 'getAllPools',
            description: 'Get all pools on a chain',
            action: 'Get all pools on chain',
          },
          {
            name: 'Get All Pools Global',
            value: 'getAllPoolsGlobal',
            description: 'Get all pools across all chains',
            action: 'Get all pools globally',
          },
          {
            name: 'Get Big Pools',
            value: 'getBigPools',
            description: 'Get pools with TVL >= $10k',
            action: 'Get big pools',
          },
          {
            name: 'Get Small Pools',
            value: 'getSmallPools',
            description: 'Get pools with TVL < $10k',
            action: 'Get small pools',
          },
          {
            name: 'Get Empty Pools',
            value: 'getEmptyPools',
            description: 'Get pools with $0 TVL',
            action: 'Get empty pools',
          },
          {
            name: 'Get Pool List',
            value: 'getPoolList',
            description: 'Get pool addresses by chain',
            action: 'Get pool list',
          },
          {
            name: 'Get Hidden Pools',
            value: 'getHiddenPools',
            description: 'Get dysfunctional/deprecated pools',
            action: 'Get hidden pools',
          },
        ],
        default: 'getAllPools',
      },
      // Volume operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['volume'],
          },
        },
        options: [
          {
            name: 'Get Pool Volumes',
            value: 'getPoolVolumes',
            description: 'Get 24h volume and base APY for pools',
            action: 'Get pool volumes',
          },
          {
            name: 'Get All Pools Volume',
            value: 'getAllPoolsVolume',
            description: 'Get total 24h volume for chain',
            action: 'Get all pools volume',
          },
          {
            name: 'Get Base APYs',
            value: 'getBaseApys',
            description: 'Get base APY data for pools',
            action: 'Get base APYs',
          },
          {
            name: 'Get Subgraph Data',
            value: 'getSubgraphData',
            description: 'Get volume/APY from subgraphs',
            action: 'Get subgraph data',
          },
          {
            name: 'Get Factory APYs',
            value: 'getFactoryApys',
            description: 'Get APYs for non-indexed chains',
            action: 'Get factory APYs',
          },
          {
            name: 'Get Factory Gauge CRV Rewards',
            value: 'getFactoryGaugeCrvRewards',
            description: 'Get unboosted CRV APRs for factory gauges',
            action: 'Get factory gauge CRV rewards',
          },
        ],
        default: 'getPoolVolumes',
      },
      // Gauge operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['gauge'],
          },
        },
        options: [
          {
            name: 'Get All Gauges',
            value: 'getAllGauges',
            description: 'Get all gauges across all chains',
            action: 'Get all gauges',
          },
          {
            name: 'Get Factory Gauges',
            value: 'getFactoryGauges',
            description: 'Get factory gauges by chain',
            action: 'Get factory gauges',
          },
          {
            name: 'Get Gauge CRV Rewards',
            value: 'getGaugeCrvRewards',
            description: 'Get CRV reward APRs by chain',
            action: 'Get gauge CRV rewards',
          },
          {
            name: 'Get Main Pool Gauge Rewards',
            value: 'getMainPoolGaugeRewards',
            description: 'Get rewards for Ethereum main registry gauges',
            action: 'Get main pool gauge rewards',
          },
        ],
        default: 'getAllGauges',
      },
      // Lending operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['lending'],
          },
        },
        options: [
          {
            name: 'Get Lending Vaults',
            value: 'getLendingVaults',
            description: 'Get vaults by chain and registry',
            action: 'Get lending vaults',
          },
          {
            name: 'Get All Lending Vaults by Chain',
            value: 'getAllLendingVaultsByChain',
            description: 'Get all vaults on a chain',
            action: 'Get all lending vaults by chain',
          },
          {
            name: 'Get All Lending Vaults',
            value: 'getAllLendingVaults',
            description: 'Get all vaults globally',
            action: 'Get all lending vaults',
          },
          {
            name: 'Get Vault Details',
            value: 'getVaultDetails',
            description: 'Get specific vault information',
            action: 'Get vault details',
          },
          {
            name: 'Get Lending Markets',
            value: 'getLendingMarkets',
            description: 'Get available lending markets',
            action: 'Get lending markets',
          },
        ],
        default: 'getAllLendingVaults',
      },
      // crvUSD operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['crvusd'],
          },
        },
        options: [
          {
            name: 'Get Total Supply',
            value: 'getTotalSupply',
            description: 'Get crvUSD total supply',
            action: 'Get crvUSD total supply',
          },
          {
            name: 'Get Circulating Supply',
            value: 'getCirculatingSupply',
            description: 'Get crvUSD circulating supply',
            action: 'Get crvUSD circulating supply',
          },
          {
            name: 'Get Total Supply Number',
            value: 'getTotalSupplyNumber',
            description: 'Get crvUSD total supply as number',
            action: 'Get crvUSD total supply number',
          },
          {
            name: 'Get scrvUSD Supply',
            value: 'getScrvusdSupply',
            description: 'Get savings crvUSD supply',
            action: 'Get scrvUSD supply',
          },
          {
            name: 'Get AMM Volumes',
            value: 'getAmmVolumes',
            description: 'Get crvUSD AMM daily volumes',
            action: 'Get crvUSD AMM volumes',
          },
        ],
        default: 'getTotalSupply',
      },
      // Token operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['token'],
          },
        },
        options: [
          {
            name: 'Get All Tokens',
            value: 'getAllTokens',
            description: 'Get all tokens in Curve pools on chain',
            action: 'Get all tokens',
          },
          {
            name: 'Get Token Price',
            value: 'getTokenPrice',
            description: 'Get token USD price from pools',
            action: 'Get token price',
          },
          {
            name: 'Search Token',
            value: 'searchToken',
            description: 'Find token by address or symbol',
            action: 'Search token',
          },
        ],
        default: 'getAllTokens',
      },
      // Protocol operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['protocol'],
          },
        },
        options: [
          {
            name: 'Get Platforms',
            value: 'getPlatforms',
            description: 'Get supported chains and registries',
            action: 'Get platforms',
          },
          {
            name: 'Get Registry Address',
            value: 'getRegistryAddress',
            description: 'Get Ethereum registry address',
            action: 'Get registry address',
          },
          {
            name: 'Get Gas Price',
            value: 'getGasPrice',
            description: 'Get Ethereum gas prices',
            action: 'Get gas price',
          },
          {
            name: 'Get Weekly Fees',
            value: 'getWeeklyFees',
            description: 'Get protocol weekly fees',
            action: 'Get weekly fees',
          },
          {
            name: 'Get Points Campaigns',
            value: 'getPointsCampaigns',
            description: 'Get active points campaigns',
            action: 'Get points campaigns',
          },
        ],
        default: 'getPlatforms',
      },
      // Include operation-specific fields
      ...pool.getPool.description,
      ...pool.getPoolsByRegistry.description,
      ...pool.getAllPools.description,
      ...pool.getAllPoolsGlobal.description,
      ...pool.getBigPools.description,
      ...pool.getSmallPools.description,
      ...pool.getEmptyPools.description,
      ...pool.getPoolList.description,
      ...pool.getHiddenPools.description,
      ...volume.getPoolVolumes.description,
      ...volume.getAllPoolsVolume.description,
      ...volume.getBaseApys.description,
      ...volume.getSubgraphData.description,
      ...volume.getFactoryApys.description,
      ...volume.getFactoryGaugeCrvRewards.description,
      ...gauge.getAllGauges.description,
      ...gauge.getFactoryGauges.description,
      ...gauge.getGaugeCrvRewards.description,
      ...gauge.getMainPoolGaugeRewards.description,
      ...lending.getLendingVaults.description,
      ...lending.getAllLendingVaultsByChain.description,
      ...lending.getAllLendingVaults.description,
      ...lending.getVaultDetails.description,
      ...lending.getLendingMarkets.description,
      ...crvusd.getTotalSupply.description,
      ...crvusd.getCirculatingSupply.description,
      ...crvusd.getTotalSupplyNumber.description,
      ...crvusd.getScrvusdSupply.description,
      ...crvusd.getAmmVolumes.description,
      ...token.getAllTokens.description,
      ...token.getTokenPrice.description,
      ...token.searchToken.description,
      ...protocol.getPlatforms.description,
      ...protocol.getRegistryAddress.description,
      ...protocol.getGasPrice.description,
      ...protocol.getWeeklyFees.description,
      ...protocol.getPointsCampaigns.description,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let result: IDataObject | IDataObject[];

        switch (resource) {
          case 'pool':
            switch (operation) {
              case 'getPool':
                result = await pool.getPool.execute.call(this, i);
                break;
              case 'getPoolsByRegistry':
                result = await pool.getPoolsByRegistry.execute.call(this, i);
                break;
              case 'getAllPools':
                result = await pool.getAllPools.execute.call(this, i);
                break;
              case 'getAllPoolsGlobal':
                result = await pool.getAllPoolsGlobal.execute.call(this, i);
                break;
              case 'getBigPools':
                result = await pool.getBigPools.execute.call(this, i);
                break;
              case 'getSmallPools':
                result = await pool.getSmallPools.execute.call(this, i);
                break;
              case 'getEmptyPools':
                result = await pool.getEmptyPools.execute.call(this, i);
                break;
              case 'getPoolList':
                result = await pool.getPoolList.execute.call(this, i);
                break;
              case 'getHiddenPools':
                result = await pool.getHiddenPools.execute.call(this, i);
                break;
              default:
                throw new Error(`Unknown pool operation: ${operation}`);
            }
            break;

          case 'volume':
            switch (operation) {
              case 'getPoolVolumes':
                result = await volume.getPoolVolumes.execute.call(this, i);
                break;
              case 'getAllPoolsVolume':
                result = await volume.getAllPoolsVolume.execute.call(this, i);
                break;
              case 'getBaseApys':
                result = await volume.getBaseApys.execute.call(this, i);
                break;
              case 'getSubgraphData':
                result = await volume.getSubgraphData.execute.call(this, i);
                break;
              case 'getFactoryApys':
                result = await volume.getFactoryApys.execute.call(this, i);
                break;
              case 'getFactoryGaugeCrvRewards':
                result = await volume.getFactoryGaugeCrvRewards.execute.call(this, i);
                break;
              default:
                throw new Error(`Unknown volume operation: ${operation}`);
            }
            break;

          case 'gauge':
            switch (operation) {
              case 'getAllGauges':
                result = await gauge.getAllGauges.execute.call(this, i);
                break;
              case 'getFactoryGauges':
                result = await gauge.getFactoryGauges.execute.call(this, i);
                break;
              case 'getGaugeCrvRewards':
                result = await gauge.getGaugeCrvRewards.execute.call(this, i);
                break;
              case 'getMainPoolGaugeRewards':
                result = await gauge.getMainPoolGaugeRewards.execute.call(this, i);
                break;
              default:
                throw new Error(`Unknown gauge operation: ${operation}`);
            }
            break;

          case 'lending':
            switch (operation) {
              case 'getLendingVaults':
                result = await lending.getLendingVaults.execute.call(this, i);
                break;
              case 'getAllLendingVaultsByChain':
                result = await lending.getAllLendingVaultsByChain.execute.call(this, i);
                break;
              case 'getAllLendingVaults':
                result = await lending.getAllLendingVaults.execute.call(this, i);
                break;
              case 'getVaultDetails':
                result = await lending.getVaultDetails.execute.call(this, i);
                break;
              case 'getLendingMarkets':
                result = await lending.getLendingMarkets.execute.call(this, i);
                break;
              default:
                throw new Error(`Unknown lending operation: ${operation}`);
            }
            break;

          case 'crvusd':
            switch (operation) {
              case 'getTotalSupply':
                result = await crvusd.getTotalSupply.execute.call(this, i);
                break;
              case 'getCirculatingSupply':
                result = await crvusd.getCirculatingSupply.execute.call(this, i);
                break;
              case 'getTotalSupplyNumber':
                result = await crvusd.getTotalSupplyNumber.execute.call(this, i);
                break;
              case 'getScrvusdSupply':
                result = await crvusd.getScrvusdSupply.execute.call(this, i);
                break;
              case 'getAmmVolumes':
                result = await crvusd.getAmmVolumes.execute.call(this, i);
                break;
              default:
                throw new Error(`Unknown crvusd operation: ${operation}`);
            }
            break;

          case 'token':
            switch (operation) {
              case 'getAllTokens':
                result = await token.getAllTokens.execute.call(this, i);
                break;
              case 'getTokenPrice':
                result = await token.getTokenPrice.execute.call(this, i);
                break;
              case 'searchToken':
                result = await token.searchToken.execute.call(this, i);
                break;
              default:
                throw new Error(`Unknown token operation: ${operation}`);
            }
            break;

          case 'protocol':
            switch (operation) {
              case 'getPlatforms':
                result = await protocol.getPlatforms.execute.call(this, i);
                break;
              case 'getRegistryAddress':
                result = await protocol.getRegistryAddress.execute.call(this, i);
                break;
              case 'getGasPrice':
                result = await protocol.getGasPrice.execute.call(this, i);
                break;
              case 'getWeeklyFees':
                result = await protocol.getWeeklyFees.execute.call(this, i);
                break;
              case 'getPointsCampaigns':
                result = await protocol.getPointsCampaigns.execute.call(this, i);
                break;
              default:
                throw new Error(`Unknown protocol operation: ${operation}`);
            }
            break;

          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        // Handle array results
        if (Array.isArray(result)) {
          for (const item of result) {
            returnData.push({ json: item });
          }
        } else {
          returnData.push({ json: result });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
