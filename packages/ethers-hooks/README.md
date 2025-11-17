# @iceberg/web3-hooks

React Hooks for Web3 development with Ethers.js

## 📦 安装

```bash
pnpm add @iceberg/web3-hooks ethers@^6
```

## ✨ 特性

- ✅ **零配置** - 无需 Provider，开箱即用
- 🎯 **单一职责** - 每个 Hook 只做一件事
- 🔌 **零耦合** - Hooks 之间完全独立
- 📘 **类型安全** - 完整的 TypeScript 支持
- 🪶 **轻量级** - 基于 Ethers.js v6
- 🎨 **灵活组合** - 自由组合使用

## 📚 Hooks 列表（共 22 个）

### 🔗 钱包连接（5个）

| Hook | 说明 |
|------|------|
| `useWallet` | 钱包连接管理 |
| `useBalance` | 余额查询 |
| `useNetwork` | 网络信息 |
| `useChainId` | 链 ID 查询 |
| `useAccount` | 账户信息 |

### 📖 合约读取（5个）

| Hook | 说明 |
|------|------|
| `useContractRead` | 合约单次读取 |
| `useContractReads` | 合约批量读取 |
| `useContractEvent` | 合约事件监听 |
| `useBlockNumber` | 区块号查询 |
| `useWatchContract` | 合约监听（所有事件） |

### ✍️ 合约写入（4个）

| Hook | 说明 |
|------|------|
| `useContractWrite` | 合约写入 |
| `useEstimateGas` | Gas 估算 |
| `useTokenApprove` | Token 授权 |
| `useWaitForTransaction` | 等待交易确认 |

### 💼 钱包交互（5个）

| Hook | 说明 |
|------|------|
| `useSignMessage` | 签名消息 |
| `useSendTransaction` | 发送交易 |
| `useSwitchNetwork` | 切换网络 |
| `useAddNetwork` | 添加网络 |
| `useWatchAsset` | 添加代币 |

### 🛠️ 工具类（3个）

| Hook | 说明 |
|------|------|
| `useENS` | ENS 解析 |
| `useTransaction` | 交易信息查询 |
| `useBlockTimestamp` | 区块时间戳 |

## 🚀 快速开始

### 1. 连接钱包

```tsx
import { useWallet } from '@iceberg/web3-hooks';

function WalletConnect() {
  const { connect, disconnect, address, isConnected } = useWallet();

  return (
    <button onClick={isConnected ? disconnect : connect}>
      {isConnected ? `已连接: ${address}` : '连接钱包'}
    </button>
  );
}
```

### 2. 查询余额

```tsx
import { useWallet, useBalance } from '@iceberg/web3-hooks';

function Balance() {
  const { address, provider } = useWallet();
  const { balance, isLoading } = useBalance({
    address,
    provider,
    watch: true // 自动监听余额变化
  });

  if (isLoading) return <div>加载中...</div>;
  return <div>余额: {balance} ETH</div>;
}
```

### 3. 读取合约

```tsx
import { useWallet, useContractRead } from '@iceberg/web3-hooks';

const ERC20_ABI = ['function balanceOf(address) view returns (uint256)'];

function TokenBalance() {
  const { address, provider } = useWallet();
  const { data, isLoading } = useContractRead({
    address: '0x...', // Token 合约地址
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    provider
  });

  return <div>代币余额: {data?.toString()}</div>;
}
```

### 4. 写入合约

```tsx
import { useWallet, useContractWrite } from '@iceberg/web3-hooks';

const ERC20_ABI = ['function transfer(address to, uint256 amount)'];

function Transfer() {
  const { provider } = useWallet();
  const { write, isLoading } = useContractWrite({
    address: '0x...', // Token 合约地址
    abi: ERC20_ABI,
    functionName: 'transfer',
    provider
  });

  const handleTransfer = async () => {
    await write(['0x...', '1000000000000000000']); // 转账 1 token
  };

  return (
    <button onClick={handleTransfer} disabled={isLoading}>
      {isLoading ? '发送中...' : '转账'}
    </button>
  );
}
```

### 5. Token 授权

```tsx
import { useWallet, useTokenApprove } from '@iceberg/web3-hooks';

function Approve() {
  const { provider } = useWallet();
  const { approve, isLoading, checkAllowance } = useTokenApprove({
    tokenAddress: '0x...', // Token 地址
    spenderAddress: '0x...', // Spender 地址
    provider
  });

  const handleApprove = async () => {
    const amount = BigInt('1000000000000000000'); // 1 token
    await approve(amount);
  };

  return (
    <button onClick={handleApprove} disabled={isLoading}>
      {isLoading ? '授权中...' : '授权'}
    </button>
  );
}
```

### 6. 签名消息

```tsx
import { useWallet, useSignMessage } from '@iceberg/web3-hooks';

function SignMessage() {
  const { provider } = useWallet();
  const { sign, signature, isLoading } = useSignMessage({ provider });

  const handleSign = async () => {
    const sig = await sign('Hello, Web3!');
    console.log('签名:', sig);
  };

  return (
    <div>
      <button onClick={handleSign} disabled={isLoading}>
        签名消息
      </button>
      {signature && <p>签名: {signature}</p>}
    </div>
  );
}
```

### 7. 切换网络

```tsx
import { useSwitchNetwork, NETWORKS } from '@iceberg/web3-hooks';

function NetworkSwitch() {
  const { switchNetwork, addNetwork, isLoading } = useSwitchNetwork();

  const handleSwitchToPolygon = async () => {
    const success = await switchNetwork('0x89'); // Polygon Mainnet
    if (!success) {
      // 如果切换失败，尝试添加网络
      await addNetwork(NETWORKS.POLYGON);
    }
  };

  return (
    <button onClick={handleSwitchToPolygon} disabled={isLoading}>
      切换到 Polygon
    </button>
  );
}
```

### 8. ENS 解析

```tsx
import { useWallet, useENS } from '@iceberg/web3-hooks';

function ENSResolver() {
  const { provider } = useWallet();

  // 正向解析：ENS -> 地址
  const { address } = useENS({ name: 'vitalik.eth', provider });

  // 反向解析：地址 -> ENS
  const { ensName } = useENS({
    name: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    provider
  });

  return (
    <div>
      <p>地址: {address}</p>
      <p>ENS: {ensName}</p>
    </div>
  );
}
```

## 🎯 完整示例

```tsx
import {
  useWallet,
  useBalance,
  useNetwork,
  useContractRead,
  useContractWrite
} from '@iceberg/web3-hooks';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount)'
];

function DApp() {
  const { connect, disconnect, address, provider, isConnected } = useWallet();
  const { balance } = useBalance({ address, provider });
  const { chainId, name } = useNetwork({ provider });

  const { data: tokenBalance } = useContractRead({
    address: '0x...', // Token 地址
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    provider
  });

  const { write: transfer, isLoading } = useContractWrite({
    address: '0x...',
    abi: ERC20_ABI,
    functionName: 'transfer',
    provider
  });

  return (
    <div>
      {/* 钱包连接 */}
      <button onClick={isConnected ? disconnect : connect}>
        {isConnected ? `已连接: ${address}` : '连接钱包'}
      </button>

      {/* 网络信息 */}
      <div>网络: {name} (Chain ID: {chainId})</div>

      {/* 余额信息 */}
      <div>ETH 余额: {balance}</div>
      <div>Token 余额: {tokenBalance?.toString()}</div>

      {/* 转账 */}
      <button
        onClick={() => transfer(['0x...', '1000000000000000000'])}
        disabled={isLoading}
      >
        {isLoading ? '发送中...' : '转账'}
      </button>
    </div>
  );
}
```

## 🆚 与 wagmi 对比

| 特性 | @iceberg/web3-hooks | wagmi |
|------|---------------------|-------|
| 配置复杂度 | ✅ 零配置 | ⚠️ 需要 Provider |
| Hook 颗粒度 | ✅ 极细（22个） | 🔶 细（约15个） |
| 学习成本 | ✅ 低 | 🔶 中等 |
| 灵活性 | ✅ 极高 | ✅ 高 |
| 依赖 | Ethers.js v6 | Viem |
| 包体积 | 🔶 中等 | ✅ 小 |

## 📖 API 文档

详细的 API 文档请查看各个 Hook 的 TypeScript 类型定义和注释。每个 Hook 都包含完整的 JSDoc 注释和使用示例。

## 🔧 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm --filter @iceberg/web3-hooks build

# 开发模式
pnpm --filter @iceberg/web3-hooks dev

# 测试
pnpm --filter @iceberg/web3-hooks test
```

## 📄 License

MIT
