import { useState, useCallback } from "react";

/**
 * 添加网络参数
 */
export interface AddNetworkParams {
  chainId: string; // 十六进制格式
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

/**
 * 添加网络状态
 */
export interface AddNetworkState {
  isLoading: boolean;
  error: Error | null;
  add: (params: AddNetworkParams) => Promise<boolean>;
}

/**
 * 常见网络配置
 */
export const NETWORKS = {
  POLYGON: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  BSC: {
    chainId: "0x38",
    chainName: "BNB Smart Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  ARBITRUM: {
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
  },
  OPTIMISM: {
    chainId: "0xa",
    chainName: "Optimism",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.optimism.io"],
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
  },
} as const;

/**
 * 添加网络 Hook
 *
 * @example
 * ```tsx
 * const { add, isLoading } = useAddNetwork();
 *
 * const handleAddPolygon = async () => {
 *   const success = await add(NETWORKS.POLYGON);
 *   if (success) {
 *     console.log('网络添加成功');
 *   }
 * };
 *
 * return (
 *   <button onClick={handleAddPolygon} disabled={isLoading}>
 *     添加 Polygon 网络
 *   </button>
 * );
 * ```
 */
export function useAddNetwork(): AddNetworkState {
  const [state, setState] = useState<Omit<AddNetworkState, "add">>({
    isLoading: false,
    error: null,
  });

  const add = useCallback(async (params: AddNetworkParams): Promise<boolean> => {
    if (!window.ethereum) {
      setState((prev) => ({ ...prev, error: new Error("未检测到钱包") }));
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params],
      });

      setState({ isLoading: false, error: null });
      return true;
    } catch (error) {
      const err = error instanceof Error ? error : new Error("添加网络失败");
      setState((prev) => ({ ...prev, isLoading: false, error: err }));
      return false;
    }
  }, []);

  return {
    ...state,
    add,
  };
}
