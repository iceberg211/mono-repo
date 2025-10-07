import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

/**
 * ENS 解析参数
 */
export interface UseENSOptions {
  name?: string | null; // ENS 名称或地址
  provider?: BrowserProvider | null;
}

/**
 * ENS 状态
 */
export interface ENSState {
  address: string | null; // 从 ENS 名称解析的地址
  ensName: string | null; // 从地址反查的 ENS 名称
  avatar: string | null; // ENS 头像
  isLoading: boolean;
  error: Error | null;
}

/**
 * ENS 解析 Hook
 *
 * @example
 * ```tsx
 * // 正向解析（ENS -> 地址）
 * const { address, isLoading } = useENS({
 *   name: 'vitalik.eth',
 *   provider
 * });
 *
 * // 反向解析（地址 -> ENS）
 * const { ensName } = useENS({
 *   name: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
 *   provider
 * });
 *
 * return <div>地址: {address || ensName}</div>;
 * ```
 */
export function useENS(options: UseENSOptions = {}): ENSState {
  const { name, provider } = options;

  const [state, setState] = useState<ENSState>({
    address: null,
    ensName: null,
    avatar: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!name || !provider) {
      setState({ address: null, ensName: null, avatar: null, isLoading: false, error: null });
      return;
    }

    let mounted = true;

    const resolveENS = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // 判断是否是地址（反向解析）或 ENS 名称（正向解析）
        const isAddress = name.startsWith("0x");

        if (isAddress) {
          // 反向解析：地址 -> ENS 名称
          const ensName = await provider.lookupAddress(name);
          const avatar = ensName ? await provider.getAvatar(ensName) : null;

          if (mounted) {
            setState({ address: name, ensName, avatar, isLoading: false, error: null });
          }
        } else {
          // 正向解析：ENS 名称 -> 地址
          const address = await provider.resolveName(name);
          const avatar = await provider.getAvatar(name);

          if (mounted) {
            setState({ address, ensName: name, avatar, isLoading: false, error: null });
          }
        }
      } catch (error) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error("ENS 解析失败"),
          }));
        }
      }
    };

    resolveENS();

    return () => {
      mounted = false;
    };
  }, [name, provider]);

  return state;
}
