import { useState, useEffect } from "react";
import { BrowserProvider, Contract, InterfaceAbi } from "ethers";

/**
 * 合约监听参数
 */
export interface UseWatchContractOptions {
  address?: string;
  abi?: InterfaceAbi;
  provider?: BrowserProvider | null;
  enabled?: boolean;
}

/**
 * 合约监听状态
 */
export interface WatchContractState {
  events: any[];
  isWatching: boolean;
  error: Error | null;
  clearEvents: () => void;
}

/**
 * 合约监听 Hook（监听所有事件）
 *
 * @example
 * ```tsx
 * const { events, isWatching, clearEvents } = useWatchContract({
 *   address: '0x...',
 *   abi: ERC20_ABI,
 *   provider
 * });
 *
 * return (
 *   <>
 *     <button onClick={clearEvents}>清空事件</button>
 *     <ul>
 *       {events.map((event, i) => (
 *         <li key={i}>{event.eventName}: {JSON.stringify(event.args)}</li>
 *       ))}
 *     </ul>
 *   </>
 * );
 * ```
 */
export function useWatchContract(
  options: UseWatchContractOptions = {}
): WatchContractState {
  const { address, abi, provider, enabled = true } = options;

  const [state, setState] = useState<Omit<WatchContractState, "clearEvents">>({
    events: [],
    isWatching: false,
    error: null,
  });

  const clearEvents = () => {
    setState((prev) => ({ ...prev, events: [] }));
  };

  useEffect(() => {
    if (!address || !abi || !provider || !enabled) {
      setState({ events: [], isWatching: false, error: null });
      return;
    }

    let mounted = true;

    try {
      const contract = new Contract(address, abi, provider);

      // 监听所有事件
      const handleAllEvents = (...args: any[]) => {
        if (mounted) {
          const event = args[args.length - 1];
          setState((prev) => ({
            ...prev,
            events: [...prev.events, event],
          }));
        }
      };

      contract.on("*", handleAllEvents);
      setState((prev) => ({ ...prev, isWatching: true, error: null }));

      return () => {
        mounted = false;
        contract.off("*", handleAllEvents);
      };
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isWatching: false,
        error: error instanceof Error ? error : new Error("合约监听失败"),
      }));
    }
  }, [address, abi, provider, enabled]);

  return {
    ...state,
    clearEvents,
  };
}
