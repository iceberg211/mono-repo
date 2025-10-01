# Iceberg Monorepo

Iceberg 是一个使用 pnpm + Lerna 管理的 Monorepo，包含以下包：

- `@iceberg/hooks`：通用 React Hooks
- `@iceberg/lib`：共享工具库
- `@iceberg/ui`：UI 组件库
- `@iceberg/cli`：命令行工具

## 快速开始

```bash
pnpm install
pnpm run bootstrap
```

> 当前各包的构建、测试、Lint 脚本仅为占位，后续可按需替换为真实命令。
