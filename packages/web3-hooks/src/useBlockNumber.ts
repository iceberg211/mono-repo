import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

/**
 * 区块号参数
 */
export interface UseBlockNumberOptions {
  provider?: BrowserProvider | null;
  watch?: boolean;
  pollingInterval?: number;
}

/**
 * 区块号状态
 */
export interface BlockNumberState {
  blockNumber: number | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * 区块号 Hook
 *
 * @example
 * ```tsx
 * const { blockNumber, isLoading } = useBlockNumber({
 *   provider,
 *   watch: true
 * });
 *
 * return <div>当前区块: {blockNumber}</div>;
 * ```
 */
export function useBlockNumber(options: UseBlockNumberOptions = {}): BlockNumberState {
  const { provider, watch = false, pollingInterval = 12000 } = options;

  const [state, setState] = useState<BlockNumberState>({
    blockNumber: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!provider) {
      setState({ blockNumber: null, isLoading: false, error: null });
      return;
    }

    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchBlockNumber = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const blockNumber = await provider.getBlockNumber();

        if (mounted) {
          setState({ blockNumber, isLoading: false, error: null });
        }
      } catch (error) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error("获取区块号失败"),
          }));
        }
      }
    };

    fetchBlockNumber();

    if (watch) {
      intervalId = setInterval(fetchBlockNumber, pollingInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [provider, watch, pollingInterval]);

  return state;
}
