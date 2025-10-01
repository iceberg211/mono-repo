import { useCallback, useState } from 'react';
import { produce, Draft } from 'immer';

/**
 * 使用 Immer 来简化不可变数据的更新
 * @param initialValue 初始状态值
 * @returns [state, updater] 状态和更新函数
 */
export function useImmer<S = any>(
  initialValue: S | (() => S)
): [S, (updater: (draft: Draft<S>) => void) => void] {
  const [state, setState] = useState(initialValue);

  const updateState = useCallback((updater: (draft: Draft<S>) => void) => {
    setState((prevState) => produce(prevState, updater) as S);
  }, []);

  return [state, updateState];
}
