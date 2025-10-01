import { useExample } from '../index';

describe('useExample', () => {
  it('返回预期的占位内容', () => {
    expect(useExample()).toBe('useExample');
  });
});
