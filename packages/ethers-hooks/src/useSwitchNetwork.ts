import { useState, useCallback } from "react";

/**
 * 网络配置
 */
export interface NetworkConfig {
  chainId: string; // 十六进制格式，如 '0x1'
  chainName: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
  blockExplorerUrls?: string[];
}

/**
 * 切换网络状态
 */
export interface SwitchNetworkState {
  isLoading: boolean;
  error: Error | null;
  switchNetwork: (chainId: string) => Promise<boolean>;
  addNetwork: (config: NetworkConfig) => Promise<boolean>;
}

/**
 * 切换网络 Hook
 *
 * @example
 * ```tsx
 * const { switchNetwork, addNetwork, isLoading } = useSwitchNetwork();
 *
 * const handleSwitchToPolygon = async () => {
 *   const success = await switchNetwork('0x89'); // Polygon Mainnet
 *   if (!success) {
 *     // 如果切换失败，尝试添加网络
 *     await addNetwork({
 *       chainId: '0x89',
 *       chainName: 'Polygon Mainnet',
 *       nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
 *       rpcUrls: ['https://polygon-rpc.com'],
 *       blockExplorerUrls: ['https://polygonscan.com']
 *     });
 *   }
 * };
 *
 * return (
 *   <button onClick={handleSwitchToPolygon} disabled={isLoading}>
 *     切换到 Polygon
 *   </button>
 * );
 * ```
 */
export function useSwitchNetwork(): SwitchNetworkState {
  const [state, setState] = useState<Omit<SwitchNetworkState, "switchNetwork" | "addNetwork">>(
    {
      isLoading: false,
      error: null,
    }
  );

  const switchNetwork = useCallback(async (chainId: string): Promise<boolean> => {
    if (!window.ethereum) {
      setState((prev) => ({ ...prev, error: new Error("未检测到钱包") }));
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });

      setState({ isLoading: false, error: null });
      return true;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error("切换网络失败");
      setState((prev) => ({ ...prev, isLoading: false, error: err }));

      // 如果错误码是 4902，表示网络未添加
      if (error.code === 4902) {
        console.log("Network not added, please use addNetwork");
      }

      return false;
    }
  }, []);

  const addNetwork = useCallback(async (config: NetworkConfig): Promise<boolean> => {
    if (!window.ethereum) {
      setState((prev) => ({ ...prev, error: new Error("未检测到钱包") }));
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [config],
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
    switchNetwork,
    addNetwork,
  };
}
