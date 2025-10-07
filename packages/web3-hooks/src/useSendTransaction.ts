import { useState, useCallback } from "react";
import { BrowserProvider, TransactionRequest, TransactionResponse } from "ethers";

/**
 * 发送交易参数
 */
export interface UseSendTransactionOptions {
  provider?: BrowserProvider | null;
}

/**
 * 发送交易状态
 */
export interface SendTransactionState {
  data: TransactionResponse | null;
  isLoading: boolean;
  error: Error | null;
  send: (tx: TransactionRequest) => Promise<TransactionResponse | null>;
  sendAsync: (tx: TransactionRequest) => Promise<TransactionResponse>;
}

/**
 * 发送交易 Hook
 *
 * @example
 * ```tsx
 * const { send, isLoading, data } = useSendTransaction({ provider });
 *
 * const handleSend = async () => {
 *   const tx = await send({
 *     to: '0x...',
 *     value: '1000000000000000000' // 1 ETH
 *   });
 *   console.log('交易哈希:', tx?.hash);
 * };
 *
 * return (
 *   <button onClick={handleSend} disabled={isLoading}>
 *     {isLoading ? '发送中...' : '发送交易'}
 *   </button>
 * );
 * ```
 */
export function useSendTransaction(
  options: UseSendTransactionOptions = {}
): SendTransactionState {
  const { provider } = options;

  const [state, setState] = useState<Omit<SendTransactionState, "send" | "sendAsync">>({
    data: null,
    isLoading: false,
    error: null,
  });

  const sendAsync = useCallback(
    async (tx: TransactionRequest): Promise<TransactionResponse> => {
      if (!provider) {
        throw new Error("缺少 provider");
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const signer = await provider.getSigner();
        const txResponse = await signer.sendTransaction(tx);

        setState({ data: txResponse, isLoading: false, error: null });
        return txResponse;
      } catch (error) {
        const err = error instanceof Error ? error : new Error("发送交易失败");
        setState((prev) => ({ ...prev, isLoading: false, error: err }));
        throw err;
      }
    },
    [provider]
  );

  const send = useCallback(
    async (tx: TransactionRequest): Promise<TransactionResponse | null> => {
      try {
        return await sendAsync(tx);
      } catch (error) {
        console.error("Send transaction error:", error);
        return null;
      }
    },
    [sendAsync]
  );

  return {
    ...state,
    send,
    sendAsync,
  };
}
