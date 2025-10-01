import { act, renderHook } from '@testing-library/react';
import { useToggle } from '../useToggle';

describe('useToggle', () => {
  it('默认在布尔值之间切换', () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(false);
  });

  it('支持自定义左右取值', () => {
    const { result } = renderHook(() => useToggle('left', 'right'));

    expect(result.current[0]).toBe('left');

    act(() => {
      result.current[1].setRight();
    });

    expect(result.current[0]).toBe('right');
  });
});
