# Repository Guidelines

## 项目结构与模块划分
仓库使用 pnpm+Lerna 单仓模式，源码集中在 `packages/*`；`cli` 承载命令行，`ui` 输出 React 组件，`hooks` 管理跨包 Hook，`lib` 收纳通用函数。新增模块时同步更新对应包的 README、脚本与导出入口。

## 构建、测试与开发命令
要求 Node ≥18 与 pnpm 9。常用命令：
- `pnpm install`：初始化依赖。
- `pnpm run bootstrap`：链接本地子包。
- `pnpm run build|lint|test`：透传到各包，当前多为占位，落地产物时务必改为真实流程。
子包可单独执行 `pnpm run <script>` 便于调试。

## 编码风格与命名约定
默认栈为 TypeScript/React 与 Node，统一 2 空格缩进和双引号，CLI 保持 CommonJS。组件与 Hook 使用 `PascalCase`，工具函数与文件使用 `camelCase`，公共入口需保留简短中文注释。

## 测试指引
暂未集成测试框架，建议在对应包 `src/__tests__/` 下新增 `*.spec.ts` 或 `*.test.tsx`，并完善 `test` 脚本。提交前运行 `pnpm run test` 覆盖核心、边界与异常路径，可为 CLI 增加快照或集成测试验证输出。

## 提交与合并请求规范
历史提交以中文描述为主，推荐“类型(范围): 摘要”格式（如 `feat(cli): 支持账号初始化`），正文补充实现与验证。PR 须写明背景、兼容性与测试结果，涉及 UI 附截图或录屏，并确保至少一名维护者审核。
