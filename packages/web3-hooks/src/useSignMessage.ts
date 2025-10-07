import { useState, useCallback } from "react";
import { BrowserProvider } from "ethers";

/**
 * 签名消息参数
 */
export interface UseSignMessageOptions {
  provider?: BrowserProvider | null;
}

/**
 * 签名消息状态
 */
export interface SignMessageState {
  signature: string | null;
  isLoading: boolean;
  error: Error | null;
  sign: (message: string) => Promise<string | null>;
  signAsync: (message: string) => Promise<string>;
}

/**
 * 签名消息 Hook
 *
 * @example
 * ```tsx
 * const { sign, isLoading, signature } = useSignMessage({ provider });
 *
 * const handleSign = async () => {
 *   const sig = await sign('Hello, Web3!');
 *   console.log('签名:', sig);
 * };
 *
 * return (
 *   <button onClick={handleSign} disabled={isLoading}>
 *     {isLoading ? '签名中...' : '签名消息'}
 *   </button>
 * );
 * ```
 */
export function useSignMessage(options: UseSignMessageOptions = {}): SignMessageState {
  const { provider } = options;

  const [state, setState] = useState<Omit<SignMessageState, "sign" | "signAsync">>({
    signature: null,
    isLoading: false,
    error: null,
  });

  const signAsync = useCallback(
    async (message: string): Promise<string> => {
      if (!provider) {
        throw new Error("缺少 provider");
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const signer = await provider.getSigner();
        const signature = await signer.signMessage(message);

        setState({ signature, isLoading: false, error: null });
        return signature;
      } catch (error) {
        const err = error instanceof Error ? error : new Error("签名失败");
        setState((prev) => ({ ...prev, isLoading: false, error: err }));
        throw err;
      }
    },
    [provider]
  );

  const sign = useCallback(
    async (message: string): Promise<string | null> => {
      try {
        return await signAsync(message);
      } catch (error) {
        console.error("Sign message error:", error);
        return null;
      }
    },
    [signAsync]
  );

  return {
    ...state,
    sign,
    signAsync,
  };
}
