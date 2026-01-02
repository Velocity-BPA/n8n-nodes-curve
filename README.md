# n8n-nodes-curve

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **Curve Finance** - the leading decentralized exchange optimized for stablecoin and pegged asset trading. This node provides full access to Curve's REST API across 21+ blockchain networks, enabling automation of DeFi workflows including liquidity pool monitoring, gauge rewards tracking, crvUSD operations, and Curve Lending (LlamaLend) integrations.

![n8n](https://img.shields.io/badge/n8n-community--node-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Chains](https://img.shields.io/badge/chains-21+-purple)

## Features

- **7 Resource Categories** with 40+ operations for comprehensive Curve Finance integration
- **21+ Blockchain Networks** including Ethereum, Arbitrum, Optimism, Polygon, and more
- **10 Trigger Types** for automated monitoring and alerting workflows
- **Multi-Registry Support** for all pool types (StableSwap, CryptoSwap, Factory pools)
- **Curve Lending Integration** for LlamaLend vault monitoring and analysis
- **crvUSD Stablecoin** supply tracking and AMM volume monitoring
- **Gauge & CRV Rewards** tracking across all supported chains
- **Full TypeScript Implementation** with comprehensive type safety

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-curve` and click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-curve

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-curve.git
cd n8n-nodes-curve

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-curve

# Restart n8n
n8n start
```

## Credentials Setup

This node uses Curve Finance's public API, which does not require authentication.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Network | Options | ethereum | Default blockchain network |
| API Base URL | String | https://api.curve.finance/v1 | Main API endpoint |
| Core API URL | String | https://api-core.curve.finance/v1 | Core API endpoint |

## Resources & Operations

### Pool Resource
| Operation | Description |
|-----------|-------------|
| Get Pool | Get specific pool details by ID and registry |
| Get Pools by Registry | Get all pools in a specific registry |
| Get All Pools | Get all pools on a chain |
| Get All Pools Global | Get all pools across all chains |
| Get Big Pools | Get pools with TVL >= $10k |
| Get Small Pools | Get pools with TVL < $10k |
| Get Empty Pools | Get pools with $0 TVL |
| Get Pool List | Get pool addresses by chain |
| Get Hidden Pools | Get dysfunctional/deprecated pools |

### Volume & APY Resource
| Operation | Description |
|-----------|-------------|
| Get Pool Volumes | Get 24h volume and base APY data |
| Get All Pools Volume | Get total 24h volume for chain |
| Get Base APYs | Get base APY data for pools |
| Get Subgraph Data | Get volume/APY from subgraphs |
| Get Factory APYs | Get APYs for non-indexed chains |
| Get Factory Gauge CRV Rewards | Get unboosted CRV APRs |

### Gauge Resource
| Operation | Description |
|-----------|-------------|
| Get All Gauges | Get all gauges across all chains |
| Get Factory Gauges | Get factory gauges by chain |
| Get Gauge CRV Rewards | Get CRV reward APRs |
| Get Main Pool Gauge Rewards | Get Ethereum main registry rewards |

### Lending Resource (Curve Lend / LlamaLend)
| Operation | Description |
|-----------|-------------|
| Get Lending Vaults | Get vaults by chain and registry |
| Get All Lending Vaults by Chain | Get all vaults on chain |
| Get All Lending Vaults | Get all vaults globally |
| Get Lending Vault Details | Get specific vault info |
| Get Lending Markets | Get available lending markets |

### crvUSD Resource
| Operation | Description |
|-----------|-------------|
| Get crvUSD Total Supply | Get total crvUSD supply |
| Get crvUSD Circulating Supply | Get circulating supply |
| Get crvUSD Total Supply Number | Get supply as number |
| Get scrvUSD Total Supply | Get savings crvUSD supply |
| Get crvUSD AMM Volumes | Get AMM daily volumes |

### Token Resource
| Operation | Description |
|-----------|-------------|
| Get All Tokens | Get tokens in Curve pools on chain |
| Get Token Price | Get token USD price from pools |
| Search Token | Search token by address/symbol |

### Protocol Resource
| Operation | Description |
|-----------|-------------|
| Get Platforms | Get supported chains and registries |
| Get Registry Address | Get Ethereum registry address |
| Get Gas Price | Get Ethereum gas prices |
| Get Weekly Fees | Get protocol weekly fees |
| Get Points Campaigns | Get active points campaigns |

## Trigger Node

The Curve Trigger node supports polling-based monitoring:

| Trigger Type | Description |
|--------------|-------------|
| Pool TVL Changed | Trigger on significant TVL change |
| New Pool Created | Trigger on new pool deployment |
| Pool APY Changed | Trigger on base APY movement |
| Large Volume Alert | Trigger on unusual trading volume |
| Gauge Rewards Changed | Trigger on reward APY update |
| New Gauge Created | Trigger on new gauge deployment |
| crvUSD Supply Changed | Trigger on supply threshold |
| crvUSD AMM Volume Alert | Trigger on AMM activity |
| New Lending Vault | Trigger on new vault deployment |
| Utilization Alert | Trigger on high market utilization |

## Usage Examples

### Monitor Pool TVL Changes

```javascript
// Example workflow: Alert when 3pool TVL changes by more than 5%
{
  "nodes": [
    {
      "name": "Curve Trigger",
      "type": "n8n-nodes-curve.curveTrigger",
      "parameters": {
        "triggerType": "poolTvlChanged",
        "network": "ethereum",
        "registry": "main",
        "poolId": "3pool",
        "tvlChangeThreshold": 5
      }
    }
  ]
}
```

### Get All Factory Pools

```javascript
// Get all factory pools on Arbitrum
{
  "nodes": [
    {
      "name": "Curve",
      "type": "n8n-nodes-curve.curve",
      "parameters": {
        "resource": "pool",
        "operation": "getPoolsByRegistry",
        "chain": "arbitrum",
        "registry": "factory"
      }
    }
  ]
}
```

### Track Lending Market Utilization

```javascript
// Monitor lending vault utilization on Ethereum
{
  "nodes": [
    {
      "name": "Curve Trigger",
      "type": "n8n-nodes-curve.curveTrigger",
      "parameters": {
        "triggerType": "lendingUtilizationAlert",
        "lendingNetwork": "ethereum",
        "utilizationThreshold": 90
      }
    }
  ]
}
```

## Curve Finance Concepts

| Term | Description |
|------|-------------|
| **StableSwap** | AMM invariant optimized for pegged assets with low slippage |
| **CryptoSwap** | AMM variant for volatile asset pairs |
| **Factory Pool** | Permissionlessly deployed pool |
| **Main Registry** | Curated pools on Ethereum mainnet |
| **Metapool** | Pool paired with base pool LP token (e.g., GUSD/3pool) |
| **Base Pool** | Foundational liquidity pool (e.g., 3pool = DAI/USDC/USDT) |
| **LP Token** | Liquidity provider token representing pool shares |
| **Gauge** | Staking contract for earning CRV rewards |
| **veCRV** | Vote-escrowed CRV for governance and boost |
| **Boost** | CRV reward multiplier (up to 2.5x) from veCRV |
| **crvUSD** | Curve's native overcollateralized stablecoin |
| **scrvUSD** | Savings/yield-bearing version of crvUSD |
| **LLAMMA** | Lending-Liquidating AMM Algorithm for soft liquidations |
| **Soft Liquidation** | Gradual collateral conversion instead of instant liquidation |
| **Bands** | Price ranges in LLAMMA system for collateral distribution |
| **Health** | Loan health factor in lending markets (higher = safer) |

## Supported Networks

| Network | Chain ID | Lending Support |
|---------|----------|-----------------|
| Ethereum | 1 | ✅ |
| Arbitrum | 42161 | ✅ |
| Optimism | 10 | ✅ |
| Polygon | 137 | ❌ |
| Base | 8453 | ❌ |
| BSC | 56 | ❌ |
| Avalanche | 43114 | ❌ |
| Fantom | 250 | ❌ |
| Fraxtal | 252 | ✅ |
| Sonic | 146 | ✅ |
| Aurora | 1313161554 | ❌ |
| Celo | 42220 | ❌ |
| Harmony | 1666600000 | ❌ |
| Kava | 2222 | ❌ |
| Mantle | 5000 | ❌ |
| Moonbeam | 1284 | ❌ |
| X-Layer | 196 | ❌ |
| xDai (Gnosis) | 100 | ❌ |
| Polygon zkEVM | 1101 | ❌ |
| zkSync Era | 324 | ❌ |
| Hyperliquid | 998 | ❌ |

## Error Handling

The node implements comprehensive error handling:

- **Rate Limiting**: Automatic retry with exponential backoff (max 3 retries)
- **Address Validation**: Ethereum address format validation for pool/token queries
- **Network Errors**: Detailed error messages with endpoint context
- **API Responses**: Proper handling of Curve API response formats

## Security Best Practices

1. **No Authentication Required**: Curve's public API doesn't require API keys
2. **Rate Limiting**: Built-in rate limiting to respect API limits
3. **Data Validation**: All inputs are validated before API calls
4. **Error Isolation**: Errors are isolated per item with `continueOnFail` support

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)
- Email: licensing@velobpa.com

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [Curve Finance Docs](https://resources.curve.fi/)
- **API Reference**: [Curve API](https://api.curve.finance/v1/openapi.json)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-curve/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Curve Finance](https://curve.fi/) for building the leading DEX for stablecoins
- [n8n](https://n8n.io/) for the powerful workflow automation platform
- The DeFi community for continuous innovation
