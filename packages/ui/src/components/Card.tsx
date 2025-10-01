import React from 'react';
import { Card as RadixCard } from '@radix-ui/themes';
import type { CardProps as RadixCardProps } from '@radix-ui/themes';

export interface CardProps extends RadixCardProps {
  /**
   * 卡片内容
   */
  children?: React.ReactNode;
}

/**
 * 基于 Radix UI 封装的卡片组件
 */
export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <RadixCard {...props}>{children}</RadixCard>;
};

Card.displayName = 'Card';
