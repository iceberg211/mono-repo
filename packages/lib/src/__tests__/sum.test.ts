import { sum } from '../index';

describe('sum', () => {
  it('正确计算两个数字之和', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
