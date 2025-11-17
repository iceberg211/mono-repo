import { useState, useCallback } from "react";
import { BrowserProvider, TransactionReceipt, TransactionResponse } from "ethers";

/**
 * 等待交易确认参数
 */
export interface UseWaitForTransactionOptions {
  provider?: BrowserProvider | null;
  confirmations?: number; // 等待的确认数
}

/**
 * 等待交易确认状态
 */
export interface WaitForTransactionState {
  receipt: TransactionReceipt | null;
  isLoading: boolean;
  error: Error | null;
  wait: (tx: TransactionResponse) => Promise<TransactionReceipt | null>;
  waitAsync: (tx: TransactionResponse) => Promise<TransactionReceipt>;
}

/**
 * 等待交易确认 Hook
 *
 * @example
 * ```tsx
 * const { wait, isLoading, receipt } = useWaitForTransaction({
 *   provider,
 *   confirmations: 2
 * });
 *
 * const handleSendTx = async () => {
 *   const tx = await sendTransaction(...);
 *   const receipt = await wait(tx);
 *   console.log('交易已确认:', receipt);
 * };
 *
 * return (
 *   <button onClick={handleSendTx} disabled={isLoading}>
 *     {isLoading ? '等待确认...' : '发送交易'}
 *   </button>
 * );
 * ```
 */
export function useWaitForTransaction(
  options: UseWaitForTransactionOptions = {}
): WaitForTransactionState {
  const { provider, confirmations = 1 } = options;

  const [state, setState] = useState<Omit<WaitForTransactionState, "wait" | "waitAsync">>({
    receipt: null,
    isLoading: false,
    error: null,
  });

  const waitAsync = useCallback(
    async (tx: TransactionResponse): Promise<TransactionReceipt> => {
      if (!provider) {
        throw new Error("缺少 provider");
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const receipt = await tx.wait(confirmations);

        if (!receipt) {
          throw new Error("交易确认失败");
        }

        setState({ receipt, isLoading: false, error: null });
        return receipt;
      } catch (error) {
        const err = error instanceof Error ? error : new Error("等待交易确认失败");
        setState((prev) => ({ ...prev, isLoading: false, error: err }));
        throw err;
      }
    },
    [provider, confirmations]
  );

  const wait = useCallback(
    async (tx: TransactionResponse): Promise<TransactionReceipt | null> => {
      try {
        return await waitAsync(tx);
      } catch (error) {
        console.error("Wait for transaction error:", error);
        return null;
      }
    },
    [waitAsync]
  );

  return {
    ...state,
    wait,
    waitAsync,
  };
}
