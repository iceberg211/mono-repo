import { useEffect, useRef } from 'react';

/**
 * 在组件卸载时执行的 Hook
 * @param fn 要执行的函数
 */
export function useUnmount(fn: () => void): void {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
}
