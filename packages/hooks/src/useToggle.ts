import { useState, useCallback } from 'react';

/**
 * 用于在两个状态值之间切换的 Hook
 * @param defaultValue 默认值
 * @param reverseValue 反转值
 * @returns [state, actions] 状态和操作方法
 */
export function useToggle<T = boolean>(
  defaultValue: T = false as T,
  reverseValue?: T
): [T, { toggle: () => void; set: (value: T) => void; setLeft: () => void; setRight: () => void }] {
  const [state, setState] = useState<T>(defaultValue);

  const toggle = useCallback(() => {
    setState((s) => (s === defaultValue ? (reverseValue ?? (!defaultValue as T)) : defaultValue));
  }, [defaultValue, reverseValue]);

  const set = useCallback((value: T) => {
    setState(value);
  }, []);

  const setLeft = useCallback(() => {
    setState(defaultValue);
  }, [defaultValue]);

  const setRight = useCallback(() => {
    setState(reverseValue ?? (!defaultValue as T));
  }, [defaultValue, reverseValue]);

  return [state, { toggle, set, setLeft, setRight }];
}
