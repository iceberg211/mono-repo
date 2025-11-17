import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

/**
 * 区块时间戳参数
 */
export interface UseBlockTimestampOptions {
  provider?: BrowserProvider | null;
  blockNumber?: number | "latest"; // 区块号，默认为 'latest'
  watch?: boolean;
  pollingInterval?: number;
}

/**
 * 区块时间戳状态
 */
export interface BlockTimestampState {
  timestamp: number | null; // Unix 时间戳（秒）
  date: Date | null; // JavaScript Date 对象
  isLoading: boolean;
  error: Error | null;
}

/**
 * 区块时间戳 Hook
 *
 * @example
 * ```tsx
 * const { timestamp, date, isLoading } = useBlockTimestamp({
 *   provider,
 *   blockNumber: 'latest',
 *   watch: true
 * });
 *
 * return (
 *   <div>
 *     <p>时间戳: {timestamp}</p>
 *     <p>日期: {date?.toLocaleString()}</p>
 *   </div>
 * );
 * ```
 */
export function useBlockTimestamp(
  options: UseBlockTimestampOptions = {}
): BlockTimestampState {
  const { provider, blockNumber = "latest", watch = false, pollingInterval = 12000 } = options;

  const [state, setState] = useState<BlockTimestampState>({
    timestamp: null,
    date: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!provider) {
      setState({ timestamp: null, date: null, isLoading: false, error: null });
      return;
    }

    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchTimestamp = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const block = await provider.getBlock(blockNumber);

        if (!block) {
          throw new Error("区块不存在");
        }

        const timestamp = block.timestamp;
        const date = new Date(timestamp * 1000);

        if (mounted) {
          setState({ timestamp, date, isLoading: false, error: null });
        }
      } catch (error) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error("获取区块时间戳失败"),
          }));
        }
      }
    };

    fetchTimestamp();

    if (watch) {
      intervalId = setInterval(fetchTimestamp, pollingInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [provider, blockNumber, watch, pollingInterval]);

  return state;
}
