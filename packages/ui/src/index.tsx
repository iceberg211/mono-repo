import type { ReactNode } from "react";
import React from "react";

/**
 * 简单的 UI 组件占位实现，演示包的基本结构。
 */
export const PlaceholderBox = ({ children }: { children?: ReactNode }) => {
  return (
    <div style={{ padding: 12, border: "1px dashed #999" }}>
      {children ?? "PlaceholderBox"}
    </div>
  );
};
