import { useState, useEffect } from "react";
import { BrowserProvider, Contract, InterfaceAbi } from "ethers";

/**
 * 单次合约调用配置
 */
export interface ContractCall {
  address: string;
  abi: InterfaceAbi;
  functionName: string;
  args?: any[];
}

/**
 * 批量合约读取参数
 */
export interface UseContractReadsOptions {
  contracts?: ContractCall[];
  provider?: BrowserProvider | null;
  watch?: boolean;
  pollingInterval?: number;
}

/**
 * 批量合约读取状态
 */
export interface ContractReadsState {
  data: any[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 批量合约读取 Hook
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useContractReads({
 *   contracts: [
 *     { address: '0x...', abi: ERC20_ABI, functionName: 'balanceOf', args: ['0x...'] },
 *     { address: '0x...', abi: ERC20_ABI, functionName: 'totalSupply' },
 *   ],
 *   provider
 * });
 *
 * return <div>Results: {JSON.stringify(data)}</div>;
 * ```
 */
export function useContractReads(
  options: UseContractReadsOptions = {}
): ContractReadsState {
  const { contracts = [], provider, watch = false, pollingInterval = 5000 } = options;

  const [state, setState] = useState<Omit<ContractReadsState, "refetch">>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchData = async () => {
    if (!contracts.length || !provider) {
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const results = await Promise.all(
        contracts.map(async ({ address, abi, functionName, args = [] }) => {
          const contract = new Contract(address, abi, provider);
          return await contract[functionName](...args);
        })
      );

      setState({ data: results, isLoading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error("批量合约读取失败"),
      }));
    }
  };

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const run = async () => {
      await fetchData();
    };

    run();

    if (watch) {
      intervalId = setInterval(run, pollingInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [JSON.stringify(contracts), provider, watch, pollingInterval]);

  return {
    ...state,
    refetch: fetchData,
  };
}
