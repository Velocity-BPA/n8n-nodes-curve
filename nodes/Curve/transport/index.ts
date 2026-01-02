/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IPollFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { API_BASE_URLS, RATE_LIMITS, DEFAULT_TIMEOUT_MS } from '../constants';

/**
 * Interface for Curve API credentials
 */
export interface ICurveCredentials {
  network: string;
  apiBaseUrl: string;
  coreApiUrl: string;
}

/**
 * API response wrapper interface
 */
export interface ICurveApiResponse<T = unknown> {
  success: boolean;
  data: T;
  generatedTimeMs?: number;
}

/**
 * Request options for Curve API
 */
export interface ICurveRequestOptions {
  method?: IHttpRequestMethods;
  endpoint: string;
  body?: IDataObject;
  qs?: IDataObject;
  useCoreApi?: boolean;
  timeout?: number;
}

/**
 * Sleep utility for rate limiting
 */
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get credentials from the execution context
 */
export async function getCredentials(
  this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
): Promise<ICurveCredentials> {
  const credentials = await this.getCredentials('curveApi');

  return {
    network: (credentials.network as string) || 'ethereum',
    apiBaseUrl: (credentials.apiBaseUrl as string) || API_BASE_URLS.MAIN,
    coreApiUrl: (credentials.coreApiUrl as string) || API_BASE_URLS.CORE,
  };
}

/**
 * Make a request to the Curve Finance API
 */
export async function curveApiRequest<T = unknown>(
  this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
  options: ICurveRequestOptions,
): Promise<T> {
  const credentials = await getCredentials.call(this);
  const { method = 'GET', endpoint, body, qs, useCoreApi = false, timeout = DEFAULT_TIMEOUT_MS } = options;

  const baseUrl = useCoreApi ? credentials.coreApiUrl : credentials.apiBaseUrl;

  const requestOptions: IHttpRequestOptions = {
    method,
    url: `${baseUrl}${endpoint}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout,
    json: true,
  };

  if (body && Object.keys(body).length > 0) {
    requestOptions.body = body;
  }

  if (qs && Object.keys(qs).length > 0) {
    requestOptions.qs = qs;
  }

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < RATE_LIMITS.MAX_RETRIES; attempt++) {
    try {
      const response = await this.helpers.httpRequest(requestOptions);

      // Handle Curve API response format
      if (response && typeof response === 'object') {
        // Some endpoints return { success: true, data: ... }
        if ('success' in response && response.success === true && 'data' in response) {
          return response.data as T;
        }
        // Some endpoints return data directly
        return response as T;
      }

      return response as T;
    } catch (error) {
      lastError = error as Error;

      // Check if it's a rate limit error (429)
      if (error instanceof NodeApiError && error.httpCode === '429') {
        const delay = RATE_LIMITS.RETRY_DELAY_MS * Math.pow(RATE_LIMITS.BACKOFF_MULTIPLIER, attempt);
        await sleep(delay);
        continue;
      }

      // For other errors, throw immediately
      throw new NodeApiError(this.getNode(), {
        message: `Curve API request failed: ${(error as Error).message}`,
        description: `Endpoint: ${endpoint}`,
      });
    }
  }

  // If we've exhausted retries, throw the last error
  throw new NodeApiError(this.getNode(), {
    message: 'Max retries exceeded for Curve API request',
    description: `Endpoint: ${endpoint}`,
  });
}

/**
 * Make a paginated request to the Curve API
 * Note: Curve API typically doesn't use pagination, but this is here for future use
 */
export async function curveApiRequestAllItems<T = unknown>(
  this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
  options: ICurveRequestOptions,
  propertyName?: string,
): Promise<T[]> {
  const response = await curveApiRequest.call(this, options) as T;

  if (propertyName && response && typeof response === 'object') {
    const data = (response as Record<string, unknown>)[propertyName];
    if (Array.isArray(data)) {
      return data as T[];
    }
  }

  if (Array.isArray(response)) {
    return response as T[];
  }

  return [response] as T[];
}

/**
 * Build endpoint path with chain ID
 */
export function buildChainEndpoint(basePath: string, chainId: string): string {
  return `${basePath}/${chainId}`;
}

/**
 * Build endpoint path with chain ID and registry
 */
export function buildRegistryEndpoint(basePath: string, chainId: string, registryId: string): string {
  return `${basePath}/${chainId}/${registryId}`;
}

/**
 * Build endpoint path with chain ID and address
 */
export function buildAddressEndpoint(basePath: string, chainId: string, address: string): string {
  return `${basePath}/${chainId}/${address}`;
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format large numbers for display
 */
export function formatLargeNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return '0';
  }

  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }

  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }

  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }

  return num.toFixed(2);
}

/**
 * Parse percentage string to number
 */
export function parsePercentage(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  const cleaned = value.replace('%', '').trim();
  return parseFloat(cleaned) || 0;
}
