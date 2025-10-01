# @iceberg/cli

Iceberg Monorepo 的命令行工具，提供基于 quicktype-core 的 TypeScript 类型生成能力。

## 功能概览
- `quicktype`：从接口 JSON 返回快速生成 TypeScript 类型定义。

## 使用示例
```bash
pnpm --filter @iceberg/cli exec iceberg quicktype \
  --input ./mock/user.json \
  --name UserResponse \
  --output ./types/user.d.ts
```

未传入参数时，CLI 将引导式询问 JSON 来源、类型名称与文件输出路径。
