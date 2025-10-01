import { useEffect } from 'react';

/**
 * 在组件挂载时执行的 Hook
 * @param fn 要执行的函数
 */
export function useMount(fn: () => void): void {
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
