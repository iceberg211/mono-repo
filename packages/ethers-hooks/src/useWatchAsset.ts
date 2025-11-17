import { useState, useCallback } from "react";

/**
 * 添加代币参数
 */
export interface WatchAssetParams {
  type: "ERC20"; // 目前仅支持 ERC20
  options: {
    address: string; // 代币合约地址
    symbol: string; // 代币符号（最多 11 个字符）
    decimals: number; // 代币小数位数
    image?: string; // 代币图标 URL
  };
}

/**
 * 添加代币状态
 */
export interface WatchAssetState {
  isLoading: boolean;
  error: Error | null;
  watch: (params: WatchAssetParams) => Promise<boolean>;
}

/**
 * 添加代币到钱包 Hook
 *
 * @example
 * ```tsx
 * const { watch, isLoading } = useWatchAsset();
 *
 * const handleAddToken = async () => {
 *   const success = await watch({
 *     type: 'ERC20',
 *     options: {
 *       address: '0x...',
 *       symbol: 'USDT',
 *       decimals: 6,
 *       image: 'https://example.com/usdt.png'
 *     }
 *   });
 *
 *   if (success) {
 *     console.log('代币已添加到钱包');
 *   }
 * };
 *
 * return (
 *   <button onClick={handleAddToken} disabled={isLoading}>
 *     添加 USDT 到钱包
 *   </button>
 * );
 * ```
 */
export function useWatchAsset(): WatchAssetState {
  const [state, setState] = useState<Omit<WatchAssetState, "watch">>({
    isLoading: false,
    error: null,
  });

  const watch = useCallback(async (params: WatchAssetParams): Promise<boolean> => {
    if (!window.ethereum) {
      setState((prev) => ({ ...prev, error: new Error("未检测到钱包") }));
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await window.ethereum.request({
        method: "wallet_watchAsset",
        params,
      });

      setState({ isLoading: false, error: null });
      return result === true;
    } catch (error) {
      const err = error instanceof Error ? error : new Error("添加代币失败");
      setState((prev) => ({ ...prev, isLoading: false, error: err }));
      return false;
    }
  }, []);

  return {
    ...state,
    watch,
  };
}
