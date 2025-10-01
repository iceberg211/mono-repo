import { useEffect, useRef, DependencyList, EffectCallback } from 'react';

/**
 * 只在更新时执行的 useEffect，忽略首次挂载
 * @param effect 副作用函数
 * @param deps 依赖项数组
 */
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
