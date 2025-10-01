import { render, screen } from '@testing-library/react';
import React from 'react';
import { PlaceholderBox } from '../index';

describe('PlaceholderBox', () => {
  it('渲染默认占位内容', () => {
    render(<PlaceholderBox />);
    expect(screen.getByText('PlaceholderBox')).toBeInTheDocument();
  });

  it('渲染传入的子节点', () => {
    render(<PlaceholderBox>测试文本</PlaceholderBox>);
    expect(screen.getByText('测试文本')).toBeInTheDocument();
  });
});
