/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IPollFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { curveApiRequest } from './transport';
import { BLOCKCHAIN_IDS, LENDING_SUPPORTED_CHAINS, BLOCKCHAIN_OPTIONS, LENDING_CHAIN_OPTIONS } from './constants/chains';
import { REGISTRY_IDS, REGISTRY_OPTIONS, LENDING_REGISTRY_IDS } from './constants/registries';

// Log licensing notice once on module load
const LICENSING_LOGGED = Symbol.for('n8n-nodes-curve-trigger.licensing.logged');
if (!(globalThis as Record<symbol, boolean>)[LICENSING_LOGGED]) {
  console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
  (globalThis as Record<symbol, boolean>)[LICENSING_LOGGED] = true;
}

interface PoolData {
  id: string;
  name: string;
  address: string;
  usdTotal?: number;
  usdTotalExcludingBasePool?: number;
}

interface GaugeData {
  gauge: string;
  name: string;
  poolAddress: string;
  crvRewardsApy?: number;
}

interface LendingVaultData {
  id: string;
  name: string;
  address: string;
  utilizationPercent?: number;
  totalDeposited?: number;
}

export class CurveTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Curve Finance Trigger',
    name: 'curveTrigger',
    icon: 'file:curve.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["triggerType"]}}',
    description: 'Monitor Curve Finance for changes in pools, gauges, crvUSD, and lending',
    defaults: {
      name: 'Curve Finance Trigger',
    },
    inputs: [],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'curveApi',
        required: true,
      },
    ],
    polling: true,
    properties: [
      {
        displayName: 'Trigger Type',
        name: 'triggerType',
        type: 'options',
        required: true,
        options: [
          {
            name: 'Pool TVL Changed',
            value: 'poolTvlChanged',
            description: 'Trigger when pool TVL changes significantly',
          },
          {
            name: 'New Pool Created',
            value: 'newPoolCreated',
            description: 'Trigger when a new pool is deployed',
          },
          {
            name: 'Pool APY Changed',
            value: 'poolApyChanged',
            description: 'Trigger when pool base APY changes',
          },
          {
            name: 'Large Volume Alert',
            value: 'largeVolumeAlert',
            description: 'Trigger on unusual trading volume',
          },
          {
            name: 'Gauge Rewards Changed',
            value: 'gaugeRewardsChanged',
            description: 'Trigger when gauge CRV rewards change',
          },
          {
            name: 'New Gauge Created',
            value: 'newGaugeCreated',
            description: 'Trigger when a new gauge is deployed',
          },
          {
            name: 'crvUSD Supply Changed',
            value: 'crvusdSupplyChanged',
            description: 'Trigger when crvUSD supply crosses threshold',
          },
          {
            name: 'crvUSD AMM Volume Alert',
            value: 'crvusdAmmVolumeAlert',
            description: 'Trigger on crvUSD AMM activity',
          },
          {
            name: 'New Lending Vault',
            value: 'newLendingVault',
            description: 'Trigger when a new lending vault is deployed',
          },
          {
            name: 'Lending Utilization Alert',
            value: 'lendingUtilizationAlert',
            description: 'Trigger on high lending market utilization',
          },
        ],
        default: 'poolTvlChanged',
      },
      // Network selection
      {
        displayName: 'Network',
        name: 'network',
        type: 'options',
        options: BLOCKCHAIN_OPTIONS,
        default: 'ethereum',
        description: 'Blockchain network to monitor',
        displayOptions: {
          hide: {
            triggerType: ['crvusdSupplyChanged', 'crvusdAmmVolumeAlert', 'newGaugeCreated'],
          },
        },
      },
      // Network for lending (limited chains)
      {
        displayName: 'Network',
        name: 'lendingNetwork',
        type: 'options',
        options: LENDING_CHAIN_OPTIONS,
        default: 'ethereum',
        description: 'Blockchain network to monitor',
        displayOptions: {
          show: {
            triggerType: ['newLendingVault', 'lendingUtilizationAlert'],
          },
        },
      },
      // Registry selection
      {
        displayName: 'Registry',
        name: 'registry',
        type: 'options',
        options: REGISTRY_OPTIONS,
        default: 'main',
        description: 'Pool registry to monitor',
        displayOptions: {
          show: {
            triggerType: ['poolTvlChanged', 'poolApyChanged', 'newPoolCreated'],
          },
        },
      },
      // Pool ID for specific pool monitoring
      {
        displayName: 'Pool ID',
        name: 'poolId',
        type: 'string',
        default: '',
        description: 'Specific pool ID to monitor (leave empty to monitor all pools in registry)',
        displayOptions: {
          show: {
            triggerType: ['poolTvlChanged', 'poolApyChanged', 'largeVolumeAlert'],
          },
        },
      },
      // TVL Change threshold
      {
        displayName: 'TVL Change Threshold (%)',
        name: 'tvlChangeThreshold',
        type: 'number',
        default: 10,
        description: 'Minimum percentage change in TVL to trigger',
        displayOptions: {
          show: {
            triggerType: ['poolTvlChanged'],
          },
        },
      },
      // APY Change threshold
      {
        displayName: 'APY Change Threshold',
        name: 'apyChangeThreshold',
        type: 'number',
        default: 1,
        description: 'Minimum absolute change in APY percentage points to trigger',
        displayOptions: {
          show: {
            triggerType: ['poolApyChanged'],
          },
        },
      },
      // Volume threshold
      {
        displayName: 'Volume Threshold (USD)',
        name: 'volumeThreshold',
        type: 'number',
        default: 1000000,
        description: 'Minimum 24h volume in USD to trigger',
        displayOptions: {
          show: {
            triggerType: ['largeVolumeAlert'],
          },
        },
      },
      // Gauge reward change threshold
      {
        displayName: 'Reward Change Threshold (%)',
        name: 'rewardChangeThreshold',
        type: 'number',
        default: 5,
        description: 'Minimum percentage change in CRV rewards to trigger',
        displayOptions: {
          show: {
            triggerType: ['gaugeRewardsChanged'],
          },
        },
      },
      // crvUSD supply threshold
      {
        displayName: 'Supply Change Threshold (%)',
        name: 'supplyChangeThreshold',
        type: 'number',
        default: 5,
        description: 'Minimum percentage change in crvUSD supply to trigger',
        displayOptions: {
          show: {
            triggerType: ['crvusdSupplyChanged'],
          },
        },
      },
      // crvUSD AMM volume threshold
      {
        displayName: 'AMM Volume Threshold (USD)',
        name: 'ammVolumeThreshold',
        type: 'number',
        default: 500000,
        description: 'Minimum daily AMM volume in USD to trigger',
        displayOptions: {
          show: {
            triggerType: ['crvusdAmmVolumeAlert'],
          },
        },
      },
      // Lending utilization threshold
      {
        displayName: 'Utilization Threshold (%)',
        name: 'utilizationThreshold',
        type: 'number',
        default: 80,
        description: 'Minimum utilization percentage to trigger',
        displayOptions: {
          show: {
            triggerType: ['lendingUtilizationAlert'],
          },
        },
      },
    ],
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    const triggerType = this.getNodeParameter('triggerType') as string;
    const webhookData = this.getWorkflowStaticData('node');

    try {
      switch (triggerType) {
        case 'poolTvlChanged':
          return await pollPoolTvlChanged.call(this, webhookData);
        case 'newPoolCreated':
          return await pollNewPoolCreated.call(this, webhookData);
        case 'poolApyChanged':
          return await pollPoolApyChanged.call(this, webhookData);
        case 'largeVolumeAlert':
          return await pollLargeVolumeAlert.call(this, webhookData);
        case 'gaugeRewardsChanged':
          return await pollGaugeRewardsChanged.call(this, webhookData);
        case 'newGaugeCreated':
          return await pollNewGaugeCreated.call(this, webhookData);
        case 'crvusdSupplyChanged':
          return await pollCrvusdSupplyChanged.call(this, webhookData);
        case 'crvusdAmmVolumeAlert':
          return await pollCrvusdAmmVolumeAlert.call(this, webhookData);
        case 'newLendingVault':
          return await pollNewLendingVault.call(this, webhookData);
        case 'lendingUtilizationAlert':
          return await pollLendingUtilizationAlert.call(this, webhookData);
        default:
          throw new Error(`Unknown trigger type: ${triggerType}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

// Poll for Pool TVL Changes
async function pollPoolTvlChanged(
  this: IPollFunctions,
  webhookData: IDataObject,
): Promise<INodeExecutionData[][] | null> {
  const network = this.getNodeParameter('network') as string;
  const registry = this.getNodeParameter('registry') as string;
  const poolId = this.getNodeParameter('poolId') as string;
  const threshold = this.getNodeParameter('tvlChangeThreshold') as number;

  const endpoint = `/getPools/${network}/${registry}`;
  const response = await curveApiRequest.call(this, { endpoint }) as IDataObject;
  const responseData = response as { data?: { poolData?: PoolData[] } };
  const pools = responseData.data?.poolData || [];

  const returnData: INodeExecutionData[] = [];
  const previousTvls = (webhookData.poolTvls as Record<string, number>) || {};
  const currentTvls: Record<string, number> = {};

  for (const pool of pools as PoolData[]) {
    if (poolId && pool.id !== poolId) continue;

    const tvl = pool.usdTotal || pool.usdTotalExcludingBasePool || 0;
    currentTvls[pool.id] = tvl;

    if (previousTvls[pool.id] !== undefined && previousTvls[pool.id] > 0) {
      const change = ((tvl - previousTvls[pool.id]) / previousTvls[pool.id]) * 100;

      if (Math.abs(change) >= threshold) {
        returnData.push({
          json: {
            triggerType: 'poolTvlChanged',
            network,
            registry,
            poolId: pool.id,
            poolName: pool.name,
            poolAddress: pool.address,
            previousTvl: previousTvls[pool.id],
            currentTvl: tvl,
            changePercent: change,
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  }

  webhookData.poolTvls = currentTvls;

  return returnData.length > 0 ? [returnData] : null;
}

// Poll for New Pool Created
async function pollNewPoolCreated(
  this: IPollFunctions,
  webhookData: IDataObject,
): Promise<INodeExecutionData[][] | null> {
  const network = this.getNodeParameter('network') as string;
  const registry = this.getNodeParameter('registry') as string;

  const endpoint = `/getPools/${network}/${registry}`;
  const response = await curveApiRequest.call(this, { endpoint }) as IDataObject;
  const responseData = response as { data?: { poolData?: PoolData[] } };
  const pools = responseData.data?.poolData || [];

  const returnData: INodeExecutionData[] = [];
  const previousPoolIds = (webhookData.poolIds as string[]) || [];
  const currentPoolIds: string[] = [];

  for (const pool of pools as PoolData[]) {
    currentPoolIds.push(pool.id);

    if (previousPoolIds.length > 0 && !previousPoolIds.includes(pool.id)) {
      returnData.push({
        json: {
          triggerType: 'newPoolCreated',
          network,
          registry,
          poolId: pool.id,
          poolName: pool.name,
          poolAddress: pool.address,
          tvl: pool.usdTotal || 0,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  webhookData.poolIds = currentPoolIds;

  return returnData.length > 0 ? [returnData] : null;
}

// Poll for Pool APY Changes
async function pollPoolApyChanged(
  this: IPollFunctions,
  webhookData: IDataObject,
): Promise<INodeExecutionData[][] | null> {
  const network = this.getNodeParameter('network') as string;
  const poolId = this.getNodeParameter('poolId') as string;
  const threshold = this.getNodeParameter('apyChangeThreshold') as number;

  const endpoint = `/getSubgraphData/${network}`;
  const response = await curveApiRequest.call(this, { endpoint }) as IDataObject;
  const responseData = response as { data?: { poolList?: PoolData[] } };
  const pools = responseData.data?.poolList || [];

  const returnData: INodeExecutionData[] = [];
  const previousApys = (webhookData.poolApys as Record<string, number>) || {};
  const currentApys: Record<string, number> = {};

  for (const pool of pools as Array<{ address: string; latestDailyApy?: number }>) {
    const id = pool.address;
    if (poolId && id !== poolId) continue;

    const apy = pool.latestDailyApy || 0;
    currentApys[id] = apy;

    if (previousApys[id] !== undefined) {
      const change = Math.abs(apy - previousApys[id]);

      if (change >= threshold) {
        returnData.push({
          json: {
            triggerType: 'poolApyChanged',
            network,
            poolAddress: id,
            previousApy: previousApys[id],
            currentApy: apy,
            changeAbsolute: apy - previousApys[id],
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  }

  webhookData.poolApys = currentApys;

  return returnData.length > 0 ? [returnData] : null;
}

// Poll for Large Volume Alert
async function pollLargeVolumeAlert(
  this: IPollFunctions,
  webhookData: IDataObject,
): Promise<INodeExecutionData[][] | null> {
  const network = this.getNodeParameter('network') as string;
  const poolId = this.getNodeParameter('poolId') as string;
  const threshold = this.getNodeParameter('volumeThreshold') as number;

  const endpoint = `/getVolumes/${network}`;
  const response = await curveApiRequest.call(this, { endpoint }) as IDataObject;
  const responseData = response as { data?: { pools?: PoolData[] } };
  const pools = responseData.data?.pools || [];

  const returnData: INodeExecutionData[] = [];
  const previousAlerts = (webhookData.volumeAlerts as Record<string, boolean>) || {};
  const currentAlerts: Record<string, boolean> = {};

  for (const pool of pools as Array<{ address: string; name?: string; volumeUSD?: number }>) {
    const id = pool.address;
    if (poolId && id !== poolId) continue;

    const volume = pool.volumeUSD || 0;
    const isAboveThreshold = volume >= threshold;
    currentAlerts[id] = isAboveThreshold;

    // Trigger only when crossing threshold upward
    if (isAboveThreshold && !previousAlerts[id]) {
      returnData.push({
        json: {
          triggerType: 'largeVolumeAlert',
          network,
          poolAddress: id,
          poolName: pool.name,
          volume24h: volume,
          threshold,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  webhookData.volumeAlerts = currentAlerts;

  return returnData.length > 0 ? [returnData] : null;
}

// Poll for Gauge Rewards Changed
async function pollGaugeRewardsChanged(
  this: IPollFunctions,
  webhookData: IDataObject,
): Promise<INodeExecutionData[][] | null> {
  const network = this.getNodeParameter('network') as string;
  const threshold = this.getNodeParameter('rewardChangeThreshold') as number;

  const endpoint = `/getFactoryGauges/${network}`;
  const response = await curveApiRequest.call(this, { endpoint }) as IDataObject;
  const responseData = response as { data?: { gauges?: GaugeData[] } };
  const gauges = responseData.data?.gauges || [];

  const returnData: INodeExecutionData[] = [];
  const previousRewards = (webhookData.gaugeRewards as Record<string, number>) || {};
  const currentRewards: Record<string, number> = {};

  for (const gauge of gauges as GaugeData[]) {
    const rewardApy = gauge.crvRewardsApy || 0;
    currentRewards[gauge.gauge] = rewardApy;

    if (previousRewards[gauge.gauge] !== undefined && previousRewards[gauge.gauge] > 0) {
      const change = ((rewardApy - previousRewards[gauge.gauge]) / previousRewards[gauge.gauge]) * 100;

      if (Math.abs(change) >= threshold) {
        returnData.push({
          json: {
            triggerType: 'gaugeRewardsChanged',
            network,
            gaugeAddress: gauge.gauge,
            gaugeName: gauge.name,
            poolAddress: gauge.poolAddress,
            previousRewardApy: previousRewards[gauge.gauge],
            currentRewardApy: rewardApy,
            changePercent: change,
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  }

  webhookData.gaugeRewards = currentRewards;

  return returnData.length > 0 ? [returnData] : null;
}

// Poll for New Gauge Created
async function pollNewGaugeCreated(
  this: IPollFunctions,
  webhookData: IDataObject,
): Promise<INodeExecutionData[][] | null> {
  const response = await curveApiRequest.call(this, { endpoint: '/getAllGauges' }) as IDataObject;
  const responseData = response as { data?: { gauges?: Record<string, unknown> } };
  const gauges = responseData.data?.gauges || responseData.data || {};

  const returnData: INodeExecutionData[] = [];
  const previousGaugeAddresses = (webhookData.gaugeAddresses as string[]) || [];
  const currentGaugeAddresses: string[] = [];

  const gaugeEntries = Object.entries(gauges);
  for (const [address, gauge] of gaugeEntries) {
    currentGaugeAddresses.push(address);

    if (previousGaugeAddresses.length > 0 && !previousGaugeAddresses.includes(address)) {
      const gaugeData = gauge as {
        name?: string;
        poolAddress?: string;
        type?: string;
        side_chain?: boolean;
      };
      returnData.push({
        json: {
          triggerType: 'newGaugeCreated',
          gaugeAddress: address,
          gaugeName: gaugeData.name,
          poolAddress: gaugeData.poolAddress,
          gaugeType: gaugeData.type,
          isSideChain: gaugeData.side_chain,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  webhookData.gaugeAddresses = currentGaugeAddresses;

  return returnData.length > 0 ? [returnData] : null;
}

// Poll for crvUSD Supply Changed
async function pollCrvusdSupplyChanged(
  this: IPollFunctions,
  webhookData: IDataObject,
): Promise<INodeExecutionData[][] | null> {
  const threshold = this.getNodeParameter('supplyChangeThreshold') as number;

  const response = await curveApiRequest.call(this, { endpoint: '/getCrvusdTotalSupply' }) as IDataObject;
  const responseData = response as { data?: { crvusdTotalSupply?: string } };
  const currentSupply = parseFloat(responseData.data?.crvusdTotalSupply || '0');

  const previousSupply = webhookData.crvusdSupply as number;
  webhookData.crvusdSupply = currentSupply;

  if (previousSupply !== undefined && previousSupply > 0) {
    const change = ((currentSupply - previousSupply) / previousSupply) * 100;

    if (Math.abs(change) >= threshold) {
      return [
        [
          {
            json: {
              triggerType: 'crvusdSupplyChanged',
              previousSupply,
              currentSupply,
              changePercent: change,
              threshold,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      ];
    }
  }

  return null;
}

// Poll for crvUSD AMM Volume Alert
async function pollCrvusdAmmVolumeAlert(
  this: IPollFunctions,
  webhookData: IDataObject,
): Promise<INodeExecutionData[][] | null> {
  const threshold = this.getNodeParameter('ammVolumeThreshold') as number;

  const response = await curveApiRequest.call(this, { endpoint: '/crvusd/markets/ethereum', useCoreApi: true }) as IDataObject;
  const responseData = response as { data?: { markets?: Array<{ address: string; name?: string; ammVolume?: number }> } };
  const markets = responseData.data?.markets || [];

  const returnData: INodeExecutionData[] = [];
  const previousAlerts = (webhookData.ammVolumeAlerts as Record<string, boolean>) || {};
  const currentAlerts: Record<string, boolean> = {};

  for (const market of markets as Array<{
    address: string;
    name?: string;
    ammVolume?: number;
  }>) {
    const volume = market.ammVolume || 0;
    const isAboveThreshold = volume >= threshold;
    currentAlerts[market.address] = isAboveThreshold;

    if (isAboveThreshold && !previousAlerts[market.address]) {
      returnData.push({
        json: {
          triggerType: 'crvusdAmmVolumeAlert',
          marketAddress: market.address,
          marketName: market.name,
          ammVolume: volume,
          threshold,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  webhookData.ammVolumeAlerts = currentAlerts;

  return returnData.length > 0 ? [returnData] : null;
}

// Poll for New Lending Vault
async function pollNewLendingVault(
  this: IPollFunctions,
  webhookData: IDataObject,
): Promise<INodeExecutionData[][] | null> {
  const network = this.getNodeParameter('lendingNetwork') as string;

  const endpoint = `/getLendingVaults/all/${network}`;
  const response = await curveApiRequest.call(this, { endpoint }) as IDataObject;
  const responseData = response as { data?: { lendingVaultData?: LendingVaultData[] } };
  const vaults = responseData.data?.lendingVaultData || [];

  const returnData: INodeExecutionData[] = [];
  const previousVaultIds = (webhookData.lendingVaultIds as string[]) || [];
  const currentVaultIds: string[] = [];

  for (const vault of vaults as LendingVaultData[]) {
    currentVaultIds.push(vault.id);

    if (previousVaultIds.length > 0 && !previousVaultIds.includes(vault.id)) {
      returnData.push({
        json: {
          triggerType: 'newLendingVault',
          network,
          vaultId: vault.id,
          vaultName: vault.name,
          vaultAddress: vault.address,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  webhookData.lendingVaultIds = currentVaultIds;

  return returnData.length > 0 ? [returnData] : null;
}

// Poll for Lending Utilization Alert
async function pollLendingUtilizationAlert(
  this: IPollFunctions,
  webhookData: IDataObject,
): Promise<INodeExecutionData[][] | null> {
  const network = this.getNodeParameter('lendingNetwork') as string;
  const threshold = this.getNodeParameter('utilizationThreshold') as number;

  const endpoint = `/getLendingVaults/all/${network}`;
  const response = await curveApiRequest.call(this, { endpoint }) as IDataObject;
  const responseData = response as { data?: { lendingVaultData?: LendingVaultData[] } };
  const vaults = responseData.data?.lendingVaultData || [];

  const returnData: INodeExecutionData[] = [];
  const previousAlerts = (webhookData.utilizationAlerts as Record<string, boolean>) || {};
  const currentAlerts: Record<string, boolean> = {};

  for (const vault of vaults as LendingVaultData[]) {
    const utilization = vault.utilizationPercent || 0;
    const isAboveThreshold = utilization >= threshold;
    currentAlerts[vault.id] = isAboveThreshold;

    if (isAboveThreshold && !previousAlerts[vault.id]) {
      returnData.push({
        json: {
          triggerType: 'lendingUtilizationAlert',
          network,
          vaultId: vault.id,
          vaultName: vault.name,
          vaultAddress: vault.address,
          utilizationPercent: utilization,
          totalDeposited: vault.totalDeposited,
          threshold,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  webhookData.utilizationAlerts = currentAlerts;

  return returnData.length > 0 ? [returnData] : null;
}
