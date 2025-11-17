import { useState, useEffect } from "react";
import { BrowserProvider, Contract, InterfaceAbi, EventLog } from "ethers";

/**
 * 合约事件监听参数
 */
export interface UseContractEventOptions {
  address?: string;
  abi?: InterfaceAbi;
  eventName?: string;
  provider?: BrowserProvider | null;
  enabled?: boolean;
}

/**
 * 合约事件状态
 */
export interface ContractEventState {
  events: EventLog[];
  isListening: boolean;
  error: Error | null;
}

/**
 * 合约事件监听 Hook
 *
 * @example
 * ```tsx
 * const { events, isListening } = useContractEvent({
 *   address: '0x...',
 *   abi: ERC20_ABI,
 *   eventName: 'Transfer',
 *   provider
 * });
 *
 * return (
 *   <ul>
 *     {events.map((event, i) => (
 *       <li key={i}>{JSON.stringify(event.args)}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export function useContractEvent(
  options: UseContractEventOptions = {}
): ContractEventState {
  const { address, abi, eventName, provider, enabled = true } = options;

  const [state, setState] = useState<ContractEventState>({
    events: [],
    isListening: false,
    error: null,
  });

  useEffect(() => {
    if (!address || !abi || !eventName || !provider || !enabled) {
      setState({ events: [], isListening: false, error: null });
      return;
    }

    let mounted = true;

    try {
      const contract = new Contract(address, abi, provider);

      const handleEvent = (...args: any[]) => {
        if (mounted) {
          const event = args[args.length - 1] as EventLog;
          setState((prev) => ({
            ...prev,
            events: [...prev.events, event],
          }));
        }
      };

      contract.on(eventName, handleEvent);
      setState((prev) => ({ ...prev, isListening: true, error: null }));

      return () => {
        mounted = false;
        contract.off(eventName, handleEvent);
      };
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isListening: false,
        error: error instanceof Error ? error : new Error("事件监听失败"),
      }));
    }
  }, [address, abi, eventName, provider, enabled]);

  return state;
}
