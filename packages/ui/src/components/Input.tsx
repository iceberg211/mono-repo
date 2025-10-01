import React from 'react';
import { TextField } from '@radix-ui/themes';
import type { TextFieldInputProps } from '@radix-ui/themes';

export interface InputProps extends TextFieldInputProps {
  /**
   * 占位符
   */
  placeholder?: string;
}

/**
 * 基于 Radix UI 封装的输入框组件
 */
export const Input: React.FC<InputProps> = ({ ...props }) => {
  return <TextField.Input {...props} />;
};

Input.displayName = 'Input';
