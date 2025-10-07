import { useState, useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";

/**
 * 余额查询参数
 */
export interface UseBalanceOptions {
  address?: string | null;
  provider?: BrowserProvider | null;
  watch?: boolean; // 是否自动监听余额变化
  pollingInterval?: number; // 轮询间隔（毫秒）
}

/**
 * 余额状态
 */
export interface BalanceState {
  balance: string | null;
  balanceWei: bigint | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * 余额查询 Hook
 *
 * @example
 * ```tsx
 * const { balance, isLoading } = useBalance({
 *   address: '0x...',
 *   watch: true
 * });
 *
 * return <div>余额: {balance} ETH</div>;
 * ```
 */
export function useBalance(options: UseBalanceOptions = {}) {
  const { address, provider, watch = false, pollingInterval = 5000 } = options;

  const [state, setState] = useState<BalanceState>({
    balance: null,
    balanceWei: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!address || !provider) {
      setState({ balance: null, balanceWei: null, isLoading: false, error: null });
      return;
    }

    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchBalance = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const balanceWei = await provider.getBalance(address);
        const balance = formatEther(balanceWei);

        if (mounted) {
          setState({ balance, balanceWei, isLoading: false, error: null });
        }
      } catch (error) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error("查询余额失败"),
          }));
        }
      }
    };

    fetchBalance();

    if (watch) {
      intervalId = setInterval(fetchBalance, pollingInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [address, provider, watch, pollingInterval]);

  return state;
}
