import { useState, useEffect } from "react";
import { BrowserProvider, Network } from "ethers";

/**
 * 网络信息参数
 */
export interface UseNetworkOptions {
  provider?: BrowserProvider | null;
}

/**
 * 网络状态
 */
export interface NetworkState {
  network: Network | null;
  chainId: number | null;
  name: string | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * 网络信息 Hook
 *
 * @example
 * ```tsx
 * const { network, chainId, name } = useNetwork({ provider });
 *
 * return <div>当前网络: {name} (Chain ID: {chainId})</div>;
 * ```
 */
export function useNetwork(options: UseNetworkOptions = {}) {
  const { provider } = options;

  const [state, setState] = useState<NetworkState>({
    network: null,
    chainId: null,
    name: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!provider) {
      setState({ network: null, chainId: null, name: null, isLoading: false, error: null });
      return;
    }

    let mounted = true;

    const fetchNetwork = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const network = await provider.getNetwork();

        if (mounted) {
          setState({
            network,
            chainId: Number(network.chainId),
            name: network.name,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error("获取网络信息失败"),
          }));
        }
      }
    };

    fetchNetwork();

    // 监听网络切换
    if (window.ethereum) {
      const handleChainChanged = () => {
        fetchNetwork();
      };
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        mounted = false;
        window.ethereum?.removeListener("chainChanged", handleChainChanged);
      };
    }

    return () => {
      mounted = false;
    };
  }, [provider]);

  return state;
}
