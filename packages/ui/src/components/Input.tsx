import React from 'react';
import { TextField } from '@radix-ui/themes';

export interface InputProps {
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 输入框大小
   */
  size?: '1' | '2' | '3';
  /**
   * 输入框变体
   */
  variant?: 'surface' | 'classic' | 'soft';
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 输入值
   */
  value?: string;
  /**
   * 默认值
   */
  defaultValue?: string;
  /**
   * 输入类型
   */
  type?: string;
  /**
   * 变化回调
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * 基于 Radix UI 封装的输入框组件
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ size, variant, ...props }, ref) => {
    return (
      <TextField.Root size={size} variant={variant}>
        <input ref={ref} {...props} />
      </TextField.Root>
    );
  }
);

Input.displayName = 'Input';
