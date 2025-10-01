# @iceberg/ui

基于 Radix UI Themes 和 Tailwind CSS 的 React 组件库。

## 特性

- 🎨 基于 Radix UI Themes 的高质量组件
- 🎯 使用 Tailwind CSS 进行样式定制
- 📖 Storybook 驱动的组件开发
- 📦 Microbundle 构建，支持 ESM 和 CJS
- 🔧 完整的 TypeScript 支持

## 已实现组件

- **Button** - 按钮组件，支持多种变体、颜色和尺寸
- **Card** - 卡片容器组件
- **Input** - 输入框组件，支持图标和多种样式

## 开发

### 启动 Storybook

```bash
pnpm storybook
```

访问 http://localhost:6006 查看组件文档和示例。

### 构建

```bash
# 开发模式（watch）
pnpm dev

# 生产构建
pnpm build
```

### 测试

```bash
pnpm test
```

## 使用

### 安装

```bash
pnpm add @iceberg/ui @radix-ui/themes
```

### 导入样式

在应用入口处导入 Radix UI 主题样式：

```tsx
import '@radix-ui/themes/styles.css';
```

### 使用组件

```tsx
import { Button, Card, Input } from '@iceberg/ui';
import { Theme } from '@radix-ui/themes';

function App() {
  return (
    <Theme>
      <Card>
        <Input placeholder="输入内容..." />
        <Button>提交</Button>
      </Card>
    </Theme>
  );
}
```

## 组件开发指南

### 创建新组件

1. 在 `src/components/` 创建组件文件，如 `NewComponent.tsx`
2. 基于 Radix UI 组件进行封装
3. 创建对应的 Story 文件 `NewComponent.stories.tsx`
4. 在 `src/index.tsx` 中导出

### 组件模板

```tsx
import React from 'react';
import { SomeRadixComponent } from '@radix-ui/themes';
import type { SomeRadixComponentProps } from '@radix-ui/themes';

export interface NewComponentProps extends SomeRadixComponentProps {
  // 自定义 props
}

export const NewComponent: React.FC<NewComponentProps> = ({ ...props }) => {
  return <SomeRadixComponent {...props} />;
};

NewComponent.displayName = 'NewComponent';
```

### Story 模板

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { NewComponent } from './NewComponent';
import { Theme } from '@radix-ui/themes';

const meta = {
  title: 'Components/NewComponent',
  component: NewComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ],
} satisfies Meta<typeof NewComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
```

## 技术栈

- React 18
- Radix UI Themes
- Tailwind CSS
- TypeScript
- Storybook 8
- Microbundle
- Vite
