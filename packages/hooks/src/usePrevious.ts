import { useEffect, useRef } from 'react';

/**
 * 保存上一次渲染时的值
 * @param value 当前值
 * @returns 上一次的值
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
