import { useState, useCallback } from "react";
import { BrowserProvider, Eip1193Provider } from "ethers";

/**
 * 钱包连接状态
 */
export interface WalletState {
  address: string | null;
  provider: BrowserProvider | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
}

/**
 * 钱包连接 Hook
 *
 * @example
 * ```tsx
 * const { connect, disconnect, address, isConnected } = useWallet();
 *
 * return (
 *   <button onClick={connect}>
 *     {isConnected ? address : '连接钱包'}
 *   </button>
 * );
 * ```
 */
export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    provider: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));

      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("请安装 MetaMask");
      }

      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      setState({
        address: accounts[0] || null,
        provider,
        chainId: Number(network.chainId),
        isConnected: true,
        isConnecting: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error : new Error("连接失败"),
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      provider: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    connect,
    disconnect,
  };
}
