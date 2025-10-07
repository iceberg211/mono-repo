import { useState, useCallback } from "react";
import { BrowserProvider, Contract, InterfaceAbi } from "ethers";

/**
 * Gas 估算参数
 */
export interface UseEstimateGasOptions {
  address?: string;
  abi?: InterfaceAbi;
  functionName?: string;
  provider?: BrowserProvider | null;
}

/**
 * Gas 估算状态
 */
export interface EstimateGasState {
  gasEstimate: bigint | null;
  isLoading: boolean;
  error: Error | null;
  estimate: (args?: any[]) => Promise<bigint | null>;
}

/**
 * Gas 估算 Hook
 *
 * @example
 * ```tsx
 * const { gasEstimate, isLoading, estimate } = useEstimateGas({
 *   address: '0x...',
 *   abi: ERC20_ABI,
 *   functionName: 'transfer',
 *   provider
 * });
 *
 * const handleEstimate = async () => {
 *   const gas = await estimate(['0x...', '1000000000000000000']);
 *   console.log('预估 Gas:', gas?.toString());
 * };
 *
 * return (
 *   <button onClick={handleEstimate}>
 *     估算 Gas
 *   </button>
 * );
 * ```
 */
export function useEstimateGas(options: UseEstimateGasOptions = {}): EstimateGasState {
  const { address, abi, functionName, provider } = options;

  const [state, setState] = useState<Omit<EstimateGasState, "estimate">>({
    gasEstimate: null,
    isLoading: false,
    error: null,
  });

  const estimate = useCallback(
    async (args: any[] = []): Promise<bigint | null> => {
      if (!address || !abi || !functionName || !provider) {
        setState((prev) => ({
          ...prev,
          error: new Error("缺少必要参数"),
        }));
        return null;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const signer = await provider.getSigner();
        const contract = new Contract(address, abi, signer);
        const gasEstimate = await contract[functionName].estimateGas(...args);

        setState({ gasEstimate, isLoading: false, error: null });
        return gasEstimate;
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Gas 估算失败");
        setState((prev) => ({ ...prev, isLoading: false, error: err }));
        return null;
      }
    },
    [address, abi, functionName, provider]
  );

  return {
    ...state,
    estimate,
  };
}
