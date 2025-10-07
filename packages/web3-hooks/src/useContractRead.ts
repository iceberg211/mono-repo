import { useState, useEffect } from "react";
import { BrowserProvider, Contract, InterfaceAbi } from "ethers";

/**
 * 合约读取参数
 */
export interface UseContractReadOptions {
  address?: string;
  abi?: InterfaceAbi;
  functionName?: string;
  args?: any[];
  provider?: BrowserProvider | null;
  watch?: boolean; // 是否自动监听数据变化
  pollingInterval?: number; // 轮询间隔（毫秒）
}

/**
 * 合约读取状态
 */
export interface ContractReadState<T = any> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 合约读取 Hook
 *
 * @example
 * ```tsx
 * const { data, isLoading, refetch } = useContractRead({
 *   address: '0x...',
 *   abi: ERC20_ABI,
 *   functionName: 'balanceOf',
 *   args: ['0x...'],
 *   provider
 * });
 *
 * return <div>Token Balance: {data?.toString()}</div>;
 * ```
 */
export function useContractRead<T = any>(
  options: UseContractReadOptions = {}
): ContractReadState<T> {
  const {
    address,
    abi,
    functionName,
    args = [],
    provider,
    watch = false,
    pollingInterval = 5000,
  } = options;

  const [state, setState] = useState<Omit<ContractReadState<T>, "refetch">>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchData = async () => {
    if (!address || !abi || !functionName || !provider) {
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const contract = new Contract(address, abi, provider);
      const result = await contract[functionName](...args);

      setState({ data: result as T, isLoading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error("合约读取失败"),
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
  }, [address, abi, functionName, JSON.stringify(args), provider, watch, pollingInterval]);

  return {
    ...state,
    refetch: fetchData,
  };
}
