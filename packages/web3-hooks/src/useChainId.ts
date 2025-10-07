import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

/**
 * 链 ID 参数
 */
export interface UseChainIdOptions {
  provider?: BrowserProvider | null;
}

/**
 * 链 ID Hook
 *
 * @example
 * ```tsx
 * const { chainId, isMainnet } = useChainId({ provider });
 *
 * return <div>Chain ID: {chainId}</div>;
 * ```
 */
export function useChainId(options: UseChainIdOptions = {}) {
  const { provider } = options;
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    if (!provider) {
      setChainId(null);
      return;
    }

    let mounted = true;

    const fetchChainId = async () => {
      try {
        const network = await provider.getNetwork();
        if (mounted) {
          setChainId(Number(network.chainId));
        }
      } catch (error) {
        console.error("Failed to fetch chain ID:", error);
      }
    };

    fetchChainId();

    // 监听链切换
    if (window.ethereum) {
      const handleChainChanged = (newChainId: string) => {
        if (mounted) {
          setChainId(parseInt(newChainId, 16));
        }
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

  const isMainnet = chainId === 1;
  const isGoerli = chainId === 5;
  const isSepolia = chainId === 11155111;
  const isPolygon = chainId === 137;
  const isBSC = chainId === 56;

  return {
    chainId,
    isMainnet,
    isGoerli,
    isSepolia,
    isPolygon,
    isBSC,
  };
}
