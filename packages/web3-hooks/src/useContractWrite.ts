import { useState, useCallback } from "react";
import { BrowserProvider, Contract, InterfaceAbi, ContractTransactionResponse } from "ethers";

/**
 * 合约写入参数
 */
export interface UseContractWriteOptions {
  address?: string;
  abi?: InterfaceAbi;
  functionName?: string;
  provider?: BrowserProvider | null;
}

/**
 * 合约写入状态
 */
export interface ContractWriteState {
  data: ContractTransactionResponse | null;
  isLoading: boolean;
  error: Error | null;
  write: (args?: any[]) => Promise<ContractTransactionResponse | null>;
  writeAsync: (args?: any[]) => Promise<ContractTransactionResponse>;
}

/**
 * 合约写入 Hook
 *
 * @example
 * ```tsx
 * const { write, isLoading, data } = useContractWrite({
 *   address: '0x...',
 *   abi: ERC20_ABI,
 *   functionName: 'transfer',
 *   provider
 * });
 *
 * const handleTransfer = async () => {
 *   await write(['0x...', '1000000000000000000']);
 * };
 *
 * return (
 *   <button onClick={handleTransfer} disabled={isLoading}>
 *     {isLoading ? '发送中...' : '转账'}
 *   </button>
 * );
 * ```
 */
export function useContractWrite(
  options: UseContractWriteOptions = {}
): ContractWriteState {
  const { address, abi, functionName, provider } = options;

  const [state, setState] = useState<Omit<ContractWriteState, "write" | "writeAsync">>({
    data: null,
    isLoading: false,
    error: null,
  });

  const writeAsync = useCallback(
    async (args: any[] = []): Promise<ContractTransactionResponse> => {
      if (!address || !abi || !functionName || !provider) {
        throw new Error("缺少必要参数");
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const signer = await provider.getSigner();
        const contract = new Contract(address, abi, signer);
        const tx = await contract[functionName](...args);

        setState({ data: tx, isLoading: false, error: null });
        return tx;
      } catch (error) {
        const err = error instanceof Error ? error : new Error("合约写入失败");
        setState((prev) => ({ ...prev, isLoading: false, error: err }));
        throw err;
      }
    },
    [address, abi, functionName, provider]
  );

  const write = useCallback(
    async (args: any[] = []): Promise<ContractTransactionResponse | null> => {
      try {
        return await writeAsync(args);
      } catch (error) {
        console.error("Contract write error:", error);
        return null;
      }
    },
    [writeAsync]
  );

  return {
    ...state,
    write,
    writeAsync,
  };
}
