import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

/**
 * 账户信息参数
 */
export interface UseAccountOptions {
  provider?: BrowserProvider | null;
}

/**
 * 账户状态
 */
export interface AccountState {
  address: string | null;
  isConnected: boolean;
}

/**
 * 账户信息 Hook
 *
 * @example
 * ```tsx
 * const { address, isConnected } = useAccount({ provider });
 *
 * return <div>地址: {address}</div>;
 * ```
 */
export function useAccount(options: UseAccountOptions = {}) {
  const { provider } = options;
  const [state, setState] = useState<AccountState>({
    address: null,
    isConnected: false,
  });

  useEffect(() => {
    if (!provider) {
      setState({ address: null, isConnected: false });
      return;
    }

    let mounted = true;

    const fetchAccount = async () => {
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        if (mounted) {
          setState({ address, isConnected: true });
        }
      } catch (error) {
        if (mounted) {
          setState({ address: null, isConnected: false });
        }
      }
    };

    fetchAccount();

    // 监听账户切换
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (mounted) {
          setState({
            address: accounts[0] || null,
            isConnected: accounts.length > 0,
          });
        }
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        mounted = false;
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    }

    return () => {
      mounted = false;
    };
  }, [provider]);

  return state;
}
