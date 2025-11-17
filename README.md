# Iceberg Monorepo

> 基于 pnpm + Lerna 的现代化 Monorepo，包含 React Hooks、工具库、UI 组件和 CLI 工具。

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0-orange.svg)](https://pnpm.io/)
[![Lerna](https://img.shields.io/badge/Lerna-7.4-purple.svg)](https://lerna.js.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📦 包结构

```
packages/
├── @iceberg/cli      - 命令行工具（quicktype 类型生成）
├── @iceberg/hooks    - 通用 React Hooks 库
├── @iceberg/lib      - 工具函数库（纯 TypeScript）
└── @iceberg/ui       - UI 组件库（Radix UI + Tailwind CSS）
```

### 各包说明

#### `@iceberg/cli`

命令行工具，提供 TypeScript 类型生成功能。

**主要功能**：

- 从 JSON 快速生成 TypeScript 类型定义
- 交互式命令行界面

**使用示例**：

```bash
pnpm --filter @iceberg/cli exec iceberg quicktype \
  --input ./data.json \
  --name UserType \
  --output ./types/user.d.ts
```

#### `@iceberg/hooks`

React Hooks 工具集，基于 Immer 和常用模式封装。

**包含 Hooks**：

- `useImmer` - 不可变状态更新
- `useToggle` - 布尔值切换
- `useDebounce` - 防抖处理
- `useThrottle` - 节流处理
- `useLocalStorage` - localStorage 持久化
- `useMount` / `useUnmount` - 生命周期
- `usePrevious` - 保存上一次的值
- `useUpdateEffect` - 仅更新时触发

**使用示例**：

```tsx
import { useImmer, useToggle } from "@iceberg/hooks";

function MyComponent() {
  const [state, updateState] = useImmer({ count: 0 });
  const [visible, { toggle }] = useToggle();

  return <div>...</div>;
}
```

#### `@iceberg/lib`

纯 TypeScript 工具函数库，无运行时依赖。

**包含模块**：

- **string** - 字符串处理（驼峰转换、截断、随机生成等）
- **array** - 数组操作（去重、分组、分块、扁平化等）
- **object** - 对象工具（深拷贝、合并、路径访问等）
- **date** - 日期处理（格式化、相对时间、计算等）
- **number** - 数字工具（格式化、精确计算、随机数等）
- **validate** - 验证函数（邮箱、手机号、身份证等）
- **browser** - 浏览器工具（Cookie、剪贴板、设备检测等）

**使用示例**：

```typescript
import { camelToKebab, unique, deepClone, formatDate } from "@iceberg/lib";

const kebabCase = camelToKebab("userName"); // 'user-name'
const uniqueArr = unique([1, 2, 2, 3]); // [1, 2, 3]
const cloned = deepClone({ a: 1, b: { c: 2 } });
const formatted = formatDate(new Date(), "YYYY-MM-DD"); // '2025-10-02'
```

#### `@iceberg/ui`

React UI 组件库，基于 Radix UI Themes 和 Tailwind CSS。

**特性**：

- 🎨 高质量 Radix UI 组件封装
- 🎯 Tailwind CSS 样式定制
- 📖 Storybook 驱动开发
- 🔧 完整 TypeScript 支持

**包含组件**：

- `Button` - 按钮（多种变体、颜色、尺寸）
- `Card` - 卡片容器
- `Input` - 输入框（支持变体和尺寸）

**使用示例**：

```tsx
import { Button, Card, Input } from "@iceberg/ui";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

function App() {
  return (
    <Theme>
      <Card>
        <Input variant="soft" placeholder="Enter text..." />
        <Button color="blue">Submit</Button>
      </Card>
    </Theme>
  );
}
```

**开发组件**：

```bash
cd packages/ui
pnpm storybook  # 访问 http://localhost:6006
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 9.0

### 安装依赖

```bash
pnpm install
pnpm run bootstrap
```

### 构建所有包

```bash
pnpm build
```

### 开发模式

```bash
# 监听所有包的变化
pnpm --filter @iceberg/ui dev
pnpm --filter @iceberg/lib dev
pnpm --filter @iceberg/hooks dev

# UI 组件开发（Storybook）
pnpm --filter @iceberg/ui storybook
```

## 🔧 开发指南

### 代码规范

```bash
# 检查代码
pnpm lint

# 自动修复
pnpm format
```

### 测试

```bash
# 运行所有测试
pnpm test

# 测试特定包
pnpm --filter @iceberg/hooks test
pnpm --filter @iceberg/lib test
pnpm --filter @iceberg/ui test
```

### 添加新包

```bash
# 在 packages/ 下创建新包
mkdir packages/new-package
cd packages/new-package
pnpm init

# 回到根目录安装依赖
cd ../..
pnpm install
```

## 📦 构建系统

| 包    | 构建工具    | 输出格式        | 说明           |
| ----- | ----------- | --------------- | -------------- |
| cli   | Node.js     | CommonJS        | 命令行脚本     |
| hooks | Microbundle | ESM + CJS + DTS | React Hooks 库 |
| lib   | Microbundle | ESM + CJS + DTS | 工具函数库     |
| ui    | Vite        | ESM + CJS + DTS | React 组件库   |

所有包都支持：

- ✅ TypeScript 类型定义
- ✅ Source Maps
- ✅ Tree-shaking（ESM）
- ✅ CommonJS 兼容（CJS）

## 🚢 发布流程

### 本地发布（开发测试）

```bash
# 构建所有包
pnpm build

# 发布到本地链接
pnpm --filter @iceberg/hooks link --global
pnpm --filter @iceberg/lib link --global
pnpm --filter @iceberg/ui link --global
```

### 发布到 npm（公开）

```bash
# 使用 Lerna 发布
npx lerna publish

# 或手动发布单个包
cd packages/hooks
npm publish --access public
```

### 发布到私有仓库（Verdaccio）

详见 [私有仓库部署指南](#-私有仓库部署verdaccio)

## 🔐 私有仓库部署（Verdaccio）

### 为什么需要私有仓库？

- ✅ **快速迭代**：内部包更新即时可用
- ✅ **私有保护**：@iceberg/\* 包只在团队内部可见
- ✅ **依赖缓存**：加速 npm 包安装
- ✅ **离线开发**：本地缓存，网络不佳时也能使用

### 部署方案

推荐使用 Docker Compose 部署（详细配置见 `.verdaccio/` 目录）：

```bash
# 启动 Verdaccio
cd .verdaccio
docker-compose up -d

# 访问 http://localhost:4873
```

### 配置客户端

```bash
# 设置 registry
npm set registry http://localhost:4873

# 或使用 .npmrc 文件
echo "registry=http://localhost:4873" > .npmrc

# 登录
npm login
```

### 发布到私仓

```bash
# 构建
pnpm build

# 发布
pnpm --filter @iceberg/hooks publish
pnpm --filter @iceberg/lib publish
pnpm --filter @iceberg/ui publish
```

详细部署文档：[Verdaccio 部署指南](./docs/verdaccio-setup.md)

## 📝 技术栈

### 核心工具

- **包管理**：pnpm + Lerna (independent)
- **语言**：TypeScript 5.4
- **构建**：Vite + Microbundle
- **代码质量**：Biome (格式化 + Lint)
- **测试**：Jest + React Testing Library

### UI 相关

- **组件库**：Radix UI Themes
- **样式**：Tailwind CSS + PostCSS
- **开发**：Storybook 8 (Vite)
- **图标**：Radix Icons

### 工具库

- **状态管理**：Immer
- **类型生成**：quicktype-core

## 📖 文档

- [开发规范](./AGENTS.md) - 编码规范和提交规范
- [组件开发指南](./packages/ui/README.md) - UI 组件开发
- [Hooks 使用文档](./packages/hooks/README.md) - Hooks API
- [工具函数文档](./packages/lib/README.md) - 工具函数 API
- [Claude Code 指南](./CLAUDE.md) - AI 辅助开发说明

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'feat(hooks): 添加新的 Hook'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

### 提交规范

使用中文提交信息，格式：`类型(范围): 摘要`

```
feat(cli): 支持账号初始化
fix(hooks): 修复 useImmer 类型问题
docs(readme): 更新文档
```

## 📄 License

MIT © Iceberg Team

## 🙏 致谢

- [Radix UI](https://www.radix-ui.com/) - 高质量 React 组件
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [pnpm](https://pnpm.io/) - 快速、节省磁盘空间的包管理器
- [Lerna](https://lerna.js.org/) - Monorepo 管理工具
