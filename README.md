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

## 质量保障

- 代码校验：`pnpm lint`（可加 `pnpm format` 自动修复）
- 单元测试：`pnpm test`
- 针对单个包执行测试示例：`pnpm --filter @iceberg/hooks test`
