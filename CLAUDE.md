# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

Iceberg is a **pnpm + Lerna** managed monorepo containing four independent packages:

- **`@iceberg/cli`**: Command-line tool for TypeScript type generation using quicktype-core. Uses CommonJS, Node.js scripts only.
- **`@iceberg/hooks`**: React Hooks library built with microbundle. Includes Immer-based state management and utility hooks.
- **`@iceberg/lib`**: Universal utility library (string, array, object, date, number, validation, browser utils). Built with microbundle.
- **`@iceberg/ui`**: React component library built with microbundle. Will integrate Tailwind CSS and Radix UI (in progress).

### Build System

All packages except CLI use **microbundle** for builds:
- **hooks/lib**: Output CJS + ESM + TypeScript declarations (`microbundle --format cjs,esm --generateTypes`)
- **ui**: JSX support with `--jsx React.createElement`
- Build outputs to `dist/` with proper `exports` field in package.json

### Testing Infrastructure

Jest is configured with **project-based** setup:
- `hooks` and `ui` use `jsdom` environment with React Testing Library
- `lib` uses `node` environment
- Module aliases: `@iceberg/*` maps to `packages/*/src/index`
- Test files: `packages/*/src/**/*.test.ts(x)`

### Styling Setup

- **Tailwind CSS** + **PostCSS** configured at root
- Entry point: `packages/ui/src/styles/tailwind.css`
- Tailwind content paths include all packages and Storybook files
- Storybook integration planned with Vite builder

## Essential Commands

### Setup and Dependencies
```bash
pnpm install          # Install all dependencies
pnpm run bootstrap    # Link local packages via Lerna
```

### Building
```bash
pnpm run build        # Build all packages via Lerna
pnpm --filter @iceberg/hooks build   # Build specific package
pnpm --filter @iceberg/lib dev       # Watch mode for development
```

### Testing
```bash
pnpm test                            # Run all tests
pnpm --filter @iceberg/hooks test    # Test specific package
jest --selectProjects lib            # Run specific Jest project
```

### Code Quality
```bash
pnpm lint             # Check code with Biome
pnpm format           # Auto-fix formatting with Biome
```

### CLI Usage
```bash
pnpm --filter @iceberg/cli exec iceberg quicktype \
  --input ./mock/user.json \
  --name UserResponse \
  --output ./types/user.d.ts
```

## Key Configuration Files

- **`lerna.json`**: Independent versioning, uses pnpm workspaces
- **`pnpm-workspace.yaml`**: Workspace definition (`packages/*`)
- **`jest.config.js`**: Multi-project Jest setup with per-package ts-jest configs
- **`tsconfig.base.json`**: Shared TypeScript config (ES2020, CommonJS, strict mode)
- **`tsconfig.json`**: Root config with path aliases for Storybook
- **`tailwind.config.js`**: Content paths cover all packages + Storybook
- **`postcss.config.js`**: Tailwind + Autoprefixer integration
- **`biome.json`**: Code formatting and linting (globals: window, document)

## Development Practices

### Coding Conventions
- **Language**: TypeScript/React for packages, CommonJS for CLI
- **Style**: 2 spaces, double quotes, unified by Biome
- **Naming**: PascalCase for components/hooks, camelCase for utilities/files
- **Comments**: Keep concise Chinese comments for public APIs

### Module Organization
- Each package has its own `src/index.ts(x)` as entry point
- Utility modules export via barrel pattern (e.g., `lib/src/index.ts` re-exports all modules)
- Hooks export individual hooks from separate files
- UI components planned to use Radix UI primitives with Tailwind styling

### Package Dependencies
- React packages use `peerDependencies` for React 18
- External dependencies specified in individual package.json
- Root devDependencies include microbundle, testing tools, and build utilities

### Git Workflow
- Commits primarily in Chinese: `类型(范围): 摘要` format
- Examples: `feat(cli): 支持账号初始化`, `fix(hooks): 修复 useImmer 类型`
- PRs require background, compatibility notes, and test results
- UI changes should include screenshots/recordings

## Important Notes

### Build Configuration
- Microbundle reads `source` field from package.json as entry point
- TypeScript is used for type checking; microbundle handles compilation
- `dist/` folders are gitignored and excluded from version control
- `files` field in package.json ensures only `dist/` is published

### Testing Strategy
- Test files colocated with source: `__tests__/*.test.ts(x)`
- Use `@testing-library/react` for component/hook tests
- Jest setup file at `jest.setup.jsdom.ts` for DOM environment
- Module name mapper allows cross-package imports in tests

### CLI Package Exception
- CLI package does NOT use microbundle (Node scripts only)
- Maintains CommonJS format for compatibility
- Uses `quicktype-core` for JSON-to-TypeScript type generation
- Interactive prompts when arguments not provided

### Storybook Integration (Planned)
- Will use Vite builder for fast development
- Preview imports Radix UI themes + Tailwind styles
- Stories will be in root `stories/` or per-package
- Path aliases configured in root tsconfig.json for imports
