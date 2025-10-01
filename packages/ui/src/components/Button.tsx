import React from 'react';
import { Button as RadixButton } from '@radix-ui/themes';
import type { ButtonProps as RadixButtonProps } from '@radix-ui/themes';

export interface ButtonProps extends RadixButtonProps {
  /**
   * 按钮内容
   */
  children?: React.ReactNode;
}

/**
 * 基于 Radix UI 封装的按钮组件
 */
export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <RadixButton {...props}>{children}</RadixButton>;
};

Button.displayName = 'Button';
