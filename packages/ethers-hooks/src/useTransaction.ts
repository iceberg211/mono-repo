import { useState, useEffect } from "react";
import { BrowserProvider, TransactionResponse } from "ethers";

/**
 * 交易查询参数
 */
export interface UseTransactionOptions {
  hash?: string | null;
  provider?: BrowserProvider | null;
  watch?: boolean; // 是否监听交易状态
}

/**
 * 交易状态
 */
export interface TransactionState {
  transaction: TransactionResponse | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * 交易信息查询 Hook
 *
 * @example
 * ```tsx
 * const { transaction, isLoading } = useTransaction({
 *   hash: '0x...',
 *   provider,
 *   watch: true
 * });
 *
 * return (
 *   <div>
 *     <p>From: {transaction?.from}</p>
 *     <p>To: {transaction?.to}</p>
 *     <p>Value: {transaction?.value.toString()}</p>
 *   </div>
 * );
 * ```
 */
export function useTransaction(options: UseTransactionOptions = {}): TransactionState {
  const { hash, provider, watch = false } = options;

  const [state, setState] = useState<TransactionState>({
    transaction: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!hash || !provider) {
      setState({ transaction: null, isLoading: false, error: null });
      return;
    }

    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchTransaction = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const transaction = await provider.getTransaction(hash);

        if (mounted) {
          setState({ transaction, isLoading: false, error: null });
        }
      } catch (error) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error("查询交易失败"),
          }));
        }
      }
    };

    fetchTransaction();

    if (watch) {
      intervalId = setInterval(fetchTransaction, 5000);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [hash, provider, watch]);

  return state;
}
