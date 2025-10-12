# Node.js CLI 开发完整指南

这是一份系统性的 CLI（命令行工具）开发指南，涵盖从零开始搭建到发布部署的完整流程。

---

## 目录

1. [CLI 基础概念](#cli-基础概念)
2. [技术选型](#技术选型)
3. [项目初始化](#项目初始化)
4. [核心功能实现](#核心功能实现)
5. [用户交互设计](#用户交互设计)
6. [错误处理与调试](#错误处理与调试)
7. [测试策略](#测试策略)
8. [发布与部署](#发布与部署)
9. [最佳实践](#最佳实践)

---

## CLI 基础概念

### 什么是 CLI

CLI（Command Line Interface）是通过命令行与程序交互的工具，用户通过输入命令和参数来执行特定任务。

**典型应用场景：**
- 构建工具（如 Webpack、Vite）
- 代码生成器（如 Yeoman、Plop）
- 项目脚手架（如 Create React App、Vue CLI）
- 开发辅助工具（如 ESLint、Prettier）

### CLI 的核心组成

```
my-cli [command] [options] [arguments]
```

- **command**：子命令（如 `git commit`）
- **options**：选项/标志（如 `--input file.json` 或 `-i file.json`）
- **arguments**：位置参数（如 `git clone <url>`）

### 工作原理

```
用户输入命令
    ↓
Shell 解析参数
    ↓
执行 bin 文件（通过 shebang）
    ↓
Node.js 运行 JS 代码
    ↓
解析参数（Commander/Yargs 等）
    ↓
执行业务逻辑
    ↓
输出结果到终端
```

---

## 技术选型

### 核心框架

| 工具 | 特点 | 适用场景 |
|------|------|----------|
| **Commander.js** | 轻量级，API 简洁，社区广泛使用 | 大多数 CLI 工具 |
| **Yargs** | 功能丰富，支持复杂参数解析 | 需要复杂命令链的工具 |
| **oclif** | Salesforce 出品，TypeScript 优先，插件系统 | 大型企业级 CLI |
| **CAC** | 极简，体积小（仅 2KB） | 轻量级工具 |

**推荐选择：Commander.js**（本指南基于此框架）

### 常用依赖库

| 功能分类 | 推荐库 | 用途 |
|---------|--------|------|
| **参数解析** | commander | 命令、选项、参数解析 |
| **交互式提示** | inquirer | 问答式用户输入 |
| **终端样式** | chalk | 彩色输出 |
| **加载动画** | ora | 等待动画 |
| **进度条** | cli-progress | 任务进度显示 |
| **表格输出** | cli-table3 | 结构化数据展示 |
| **文件操作** | fs-extra | 增强的文件系统 API |
| **Shell 命令** | shelljs | 跨平台 shell 操作 |
| **ASCII 艺术** | figlet | 启动横幅 |
| **日志** | winston / pino | 结构化日志 |

---

## 项目初始化

### 1. 创建项目结构

```bash
mkdir my-cli && cd my-cli
npm init -y
```

推荐目录结构：

```
my-cli/
├── bin/
│   └── cli.js              # 可执行入口（含 shebang）
├── src/
│   ├── index.js            # 主程序逻辑
│   ├── commands/           # 子命令模块
│   │   ├── init.js
│   │   └── build.js
│   ├── utils/              # 工具函数
│   │   ├── logger.js
│   │   └── file.js
│   └── config.js           # 配置管理
├── test/                   # 测试文件
├── package.json
└── README.md
```

### 2. 配置 package.json

```json
{
  "name": "my-cli",
  "version": "1.0.0",
  "description": "A powerful CLI tool",
  "main": "src/index.js",
  "bin": {
    "mycli": "bin/cli.js"
  },
  "scripts": {
    "dev": "node bin/cli.js",
    "test": "jest"
  },
  "keywords": ["cli", "tool"],
  "author": "Your Name",
  "license": "MIT",
  "engines": {
    "node": ">=14.0.0"
  },
  "dependencies": {
    "commander": "^11.0.0",
    "inquirer": "^9.0.0",
    "chalk": "^5.0.0",
    "ora": "^7.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

**关键配置说明：**
- `bin`：定义命令名和可执行文件路径
- `engines`：指定 Node.js 版本要求
- `main`：程序入口（供 `require()` 使用）

### 3. 创建可执行入口

**`bin/cli.js`：**

```javascript
#!/usr/bin/env node

// Shebang 声明：告诉系统用 Node.js 执行此文件

const { run } = require('../src/index.js');

// 执行主程序，捕获顶层异常
run(process.argv).catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);  // 非零退出码表示失败
});
```

**重要：**
- 第一行必须是 `#!/usr/bin/env node`
- 文件需要可执行权限（`chmod +x bin/cli.js`）

### 4. 本地测试

```bash
# 链接到全局
npm link

# 测试命令
mycli --help

# 取消链接
npm unlink
```

---

## 核心功能实现

### 1. 初始化 Commander 程序

**`src/index.js`：**

```javascript
const { Command } = require('commander');
const pkg = require('../package.json');

async function run(argv) {
  const program = new Command();

  // 基础配置
  program
    .name('mycli')
    .description('A powerful CLI tool')
    .version(pkg.version);

  // 注册命令
  registerCommands(program);

  // 解析参数
  await program.parseAsync(argv);
}

function registerCommands(program) {
  // 将在后续章节实现
}

module.exports = { run };
```

### 2. 实现简单命令

**示例：实现 `mycli greet` 命令**

**`src/commands/greet.js`：**

```javascript
const chalk = require('chalk');

async function handleGreet(name, options) {
  const greeting = options.uppercase
    ? `HELLO, ${name.toUpperCase()}!`
    : `Hello, ${name}!`;

  console.log(chalk.green(greeting));
}

function registerGreetCommand(program) {
  program
    .command('greet <name>')  // <name> 是必需参数
    .description('Greet someone')
    .option('-u, --uppercase', 'Use uppercase')
    .action(handleGreet);
}

module.exports = { registerGreetCommand };
```

**在 `src/index.js` 中注册：**

```javascript
const { registerGreetCommand } = require('./commands/greet');

function registerCommands(program) {
  registerGreetCommand(program);
}
```

**使用：**

```bash
mycli greet John           # 输出：Hello, John!
mycli greet John -u        # 输出：HELLO, JOHN!
```

### 3. 参数类型详解

#### 必需参数（Required）

```javascript
program.command('copy <source> <destination>')
```

#### 可选参数（Optional）

```javascript
program.command('list [directory]')  // 方括号表示可选
```

#### 可变参数（Variadic）

```javascript
program.command('remove <files...>')  // 接受多个值
```

#### 选项（Options）

```javascript
program
  .option('-f, --force', 'Force operation')           // 布尔标志
  .option('-p, --port <number>', 'Port number', 3000) // 带默认值
  .option('-c, --config <path>', 'Config file')       // 必需值
```

### 4. 实现复杂命令

**示例：文件生成器**

**`src/commands/generate.js`：**

```javascript
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');

async function handleGenerate(type, name, options) {
  const spinner = ora(`Generating ${type}...`).start();

  try {
    const targetPath = path.resolve(process.cwd(), options.output || name);

    // 检查文件是否存在
    if (await fs.pathExists(targetPath) && !options.force) {
      spinner.fail('File already exists. Use --force to overwrite.');
      process.exitCode = 1;
      return;
    }

    // 生成内容
    const content = getTemplate(type, name);

    // 写入文件
    await fs.outputFile(targetPath, content);

    spinner.succeed(chalk.green(`Generated ${type} at ${targetPath}`));
  } catch (error) {
    spinner.fail('Generation failed');
    console.error(chalk.red(error.message));
    process.exitCode = 1;
  }
}

function getTemplate(type, name) {
  const templates = {
    component: `export default function ${name}() {\n  return <div>${name}</div>;\n}`,
    function: `export function ${name}() {\n  // TODO: implement\n}`,
  };
  return templates[type] || `// ${name}`;
}

function registerGenerateCommand(program) {
  program
    .command('generate <type> <name>')
    .alias('g')  // 别名：mycli g component Button
    .description('Generate code from templates')
    .option('-o, --output <path>', 'Output path')
    .option('-f, --force', 'Overwrite existing files')
    .action(handleGenerate);
}

module.exports = { registerGenerateCommand };
```

**使用：**

```bash
mycli generate component Button
mycli g function utils -o src/utils.js
mycli g component Header -f  # 强制覆盖
```

---

## 用户交互设计

### 1. 交互式提示（Inquirer）

#### 基本用法

```javascript
const inquirer = require('inquirer');

async function promptUser() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'What is your name?',
      default: 'Guest',
      validate: (input) => {
        return input.length > 0 || 'Name cannot be empty';
      }
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Choose a framework:',
      choices: ['React', 'Vue', 'Angular', 'Svelte']
    },
    {
      type: 'confirm',
      name: 'useTypeScript',
      message: 'Use TypeScript?',
      default: true
    }
  ]);

  console.log(answers);
  // { username: 'John', framework: 'React', useTypeScript: true }
}
```

#### 所有提示类型

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| `input` | 文本输入 | 名称、路径等 |
| `number` | 数字输入 | 端口号、数量等 |
| `confirm` | 是/否确认 | 确认操作 |
| `list` | 单选列表 | 选择框架、模板等 |
| `rawlist` | 数字编号列表 | 同上，显示序号 |
| `expand` | 快捷键选择 | 快速选择（按首字母）|
| `checkbox` | 多选列表 | 选择多个插件 |
| `password` | 密码输入 | 敏感信息 |
| `editor` | 打开编辑器 | 多行文本、JSON 等 |

#### 条件提示（when）

```javascript
{
  type: 'input',
  name: 'port',
  message: 'Enter port:',
  when: (answers) => answers.useCustomPort === true,
  default: 3000
}
```

#### 动态选项（choices 函数）

```javascript
{
  type: 'list',
  name: 'file',
  message: 'Select a file:',
  choices: async () => {
    const files = await fs.readdir('./src');
    return files.filter(f => f.endsWith('.js'));
  }
}
```

### 2. 渐进式参数处理模式

**核心思想：命令行参数 → 交互式提示 → 默认值**

```javascript
async function resolveOptions(cliOptions) {
  let { name, type, output } = cliOptions;

  // 1. 如果命令行未提供，启动交互式提示
  if (!name) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter component name:',
        validate: (input) => input.trim() !== '' || 'Name required'
      }
    ]);
    name = answers.name;
  }

  if (!type) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select type:',
        choices: ['component', 'hook', 'util']
      }
    ]);
    type = answers.type;
  }

  // 2. 应用默认值
  output = output || path.join(process.cwd(), `${name}.js`);

  return { name, type, output };
}

// 在命令中使用
async function handleCreate(options) {
  const resolved = await resolveOptions(options);
  // ... 使用 resolved.name, resolved.type, resolved.output
}
```

### 3. 终端美化

#### 彩色输出（Chalk）

```javascript
const chalk = require('chalk');

console.log(chalk.green('✓ Success'));
console.log(chalk.red.bold('✗ Error'));
console.log(chalk.yellow('⚠ Warning'));
console.log(chalk.blue.underline('Info'));
console.log(chalk.gray('Debug'));

// 模板字符串
console.log(chalk`{green Success:} File created at {cyan ${path}}`);
```

#### 加载动画（Ora）

```javascript
const ora = require('ora');

async function longTask() {
  const spinner = ora('Loading...').start();

  try {
    await doSomething();
    spinner.text = 'Processing...';
    await doMore();
    spinner.succeed('Done!');
  } catch (error) {
    spinner.fail('Failed');
  }
}

// 自定义样式
const spinner = ora({
  text: 'Loading',
  spinner: 'dots',  // dots, line, star, etc.
  color: 'yellow'
}).start();
```

#### 进度条（cli-progress）

```javascript
const cliProgress = require('cli-progress');

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar.start(100, 0);

for (let i = 0; i <= 100; i++) {
  bar.update(i);
  await delay(50);
}

bar.stop();
```

#### 表格输出（cli-table3）

```javascript
const Table = require('cli-table3');

const table = new Table({
  head: ['Name', 'Version', 'License'],
  colWidths: [20, 10, 10]
});

table.push(
  ['React', '18.2.0', 'MIT'],
  ['Vue', '3.3.4', 'MIT']
);

console.log(table.toString());
```

---

## 错误处理与调试

### 1. 错误处理策略

#### 顶层错误捕获

```javascript
// bin/cli.js
run(process.argv).catch((error) => {
  console.error(chalk.red('Fatal error:'), error.message);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});
```

#### 命令级错误处理

```javascript
async function handleCommand(options) {
  try {
    await doSomething();
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(chalk.red('File not found'));
    } else {
      console.error(chalk.red('Error:'), error.message);
    }
    process.exitCode = 1;  // 推荐：设置退出码但不立即退出
  }
}
```

#### 自定义错误类

```javascript
class CLIError extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.name = 'CLIError';
    this.exitCode = exitCode;
  }
}

// 使用
throw new CLIError('Invalid configuration', 2);
```

### 2. 退出码规范

```javascript
process.exitCode = 0;  // 成功
process.exitCode = 1;  // 一般错误
process.exitCode = 2;  // 参数错误
process.exitCode = 126; // 命令无法执行
process.exitCode = 127; // 命令未找到
```

### 3. 调试模式

```javascript
const debug = require('debug')('mycli');

// 使用
debug('Loading config from %s', configPath);
debug('Options: %O', options);

// 运行时启用：DEBUG=mycli mycli build
```

### 4. 日志管理

```javascript
// src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'cli.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;

// 使用
logger.info('Command executed', { command: 'build' });
logger.error('Failed to read file', { path, error });
```

---

## 测试策略

### 1. 单元测试（Jest）

```javascript
// test/utils.test.js
const { toPascalCase } = require('../src/utils');

describe('toPascalCase', () => {
  test('converts kebab-case to PascalCase', () => {
    expect(toPascalCase('my-component')).toBe('MyComponent');
  });

  test('handles empty string', () => {
    expect(toPascalCase('')).toBe('');
  });
});
```

### 2. 命令测试

```javascript
// test/commands/greet.test.js
const { run } = require('../src/index');

describe('greet command', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('greets user', async () => {
    await run(['node', 'cli.js', 'greet', 'John']);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hello, John')
    );
  });
});
```

### 3. 集成测试

```javascript
const execa = require('execa');
const fs = require('fs-extra');

describe('generate command', () => {
  test('creates file', async () => {
    const testDir = './test-output';
    await fs.ensureDir(testDir);

    await execa('node', ['bin/cli.js', 'generate', 'component', 'Button'], {
      cwd: testDir
    });

    const exists = await fs.pathExists(`${testDir}/Button.js`);
    expect(exists).toBe(true);

    await fs.remove(testDir);
  });
});
```

---

## 发布与部署

### 1. 准备发布

#### 完善 package.json

```json
{
  "name": "my-cli",
  "version": "1.0.0",
  "description": "A powerful CLI tool",
  "keywords": ["cli", "generator", "tool"],
  "homepage": "https://github.com/username/my-cli#readme",
  "bugs": {
    "url": "https://github.com/username/my-cli/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/username/my-cli.git"
  },
  "license": "MIT",
  "author": "Your Name <email@example.com>",
  "files": [
    "bin",
    "src",
    "README.md",
    "LICENSE"
  ]
}
```

**`files` 字段**：指定发布到 npm 的文件（不包括 node_modules、test 等）

#### 编写 README

必须包含：
- 安装方法
- 使用示例
- 命令列表
- 配置选项
- 贡献指南

### 2. 发布到 npm

```bash
# 登录 npm
npm login

# 检查打包内容
npm pack --dry-run

# 发布
npm publish

# 发布测试版
npm publish --tag beta
```

### 3. 版本管理（Semantic Versioning）

```bash
npm version patch  # 1.0.0 -> 1.0.1 (bug 修复)
npm version minor  # 1.0.0 -> 1.1.0 (新功能)
npm version major  # 1.0.0 -> 2.0.0 (破坏性变更)
```

### 4. 安装方式

```bash
# 全局安装
npm install -g my-cli

# 项目本地安装
npm install --save-dev my-cli

# 使用 npx（无需安装）
npx my-cli generate component Button
```

### 5. CI/CD 集成

**GitHub Actions 示例（`.github/workflows/publish.yml`）：**

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 最佳实践

### 1. 设计原则

#### ✅ 友好的默认值
```javascript
// 好
.option('-p, --port <number>', 'Port number', 3000)

// 差
.option('-p, --port <number>', 'Port number')  // 用户必须输入
```

#### ✅ 清晰的错误提示
```javascript
// 好
console.error(chalk.red(`Error: File "${path}" not found. Did you mean "${suggest}"?`));

// 差
console.error('Error');
```

#### ✅ 渐进式体验
```javascript
// 支持三种使用方式：
mycli build --input src --output dist              // 完整参数
mycli build --input src                            // 部分参数
mycli build                                        // 纯交互式
```

#### ✅ 提供帮助信息
```javascript
program
  .command('build')
  .description('Build the project')
  .option('-i, --input <path>', 'Source directory')
  .addHelpText('after', `
Example:
  $ mycli build --input src
  $ mycli build -i src -o dist
  `);
```

### 2. 性能优化

#### 延迟加载

```javascript
// 不要在顶层导入大型依赖
// 差
const babel = require('@babel/core');

// 好
program.command('compile').action(async () => {
  const babel = require('@babel/core');
  // ...
});
```

#### 异步操作

```javascript
// 并行执行多个任务
await Promise.all([
  task1(),
  task2(),
  task3()
]);
```

### 3. 安全考虑

#### 验证用户输入

```javascript
const path = require('path');

function validatePath(input) {
  const resolved = path.resolve(input);
  const cwd = process.cwd();

  // 防止路径遍历攻击
  if (!resolved.startsWith(cwd)) {
    throw new Error('Invalid path');
  }

  return resolved;
}
```

#### 避免命令注入

```javascript
// 差：直接拼接用户输入
shell.exec(`rm -rf ${userInput}`);

// 好：使用参数化 API
await fs.remove(userInput);
```

### 4. 跨平台兼容

```javascript
// 使用跨平台的路径处理
const path = require('path');
const output = path.join(__dirname, 'output', 'file.txt');

// 使用 shelljs 而不是原生 shell 命令
const shell = require('shelljs');
shell.mkdir('-p', 'nested/directories');

// 检测操作系统
if (process.platform === 'win32') {
  // Windows 特定逻辑
}
```

### 5. 配置文件支持

```javascript
// src/config.js
const fs = require('fs-extra');
const path = require('path');

const CONFIG_FILES = [
  'mycli.config.js',
  '.myclirc.json',
  '.myclirc'
];

async function loadConfig() {
  for (const filename of CONFIG_FILES) {
    const filepath = path.join(process.cwd(), filename);
    if (await fs.pathExists(filepath)) {
      return require(filepath);
    }
  }
  return {};
}

// package.json 中的配置
const pkg = await fs.readJSON('package.json');
const config = pkg.mycli || {};
```

### 6. 更新检查

```javascript
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

const notifier = updateNotifier({ pkg });
notifier.notify();
```

### 7. 文档规范

每个命令都应该有：
- `description()`：简短说明
- `option()` 的描述文本
- `.addHelpText()`：使用示例
- README 中的详细文档

---

## 进阶主题

### 1. 插件系统

```javascript
// 支持用户自定义插件
const plugins = await loadPlugins();
plugins.forEach(plugin => {
  plugin.register(program);
});
```

### 2. 多语言支持（i18n）

```javascript
const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'zh'],
  directory: path.join(__dirname, 'locales')
});

console.log(i18n.__('greeting', { name: 'John' }));
```

### 3. 自动补全

使用 `omelette` 库为 CLI 添加 shell 自动补全：

```javascript
const omelette = require('omelette');

const completion = omelette('mycli <command>');
completion.on('command', ({ reply }) => {
  reply(['build', 'generate', 'init']);
});
completion.init();
```

---

## 学习资源

### 优秀 CLI 工具源码

- **Vue CLI**: https://github.com/vuejs/vue-cli
- **Create React App**: https://github.com/facebook/create-react-app
- **Vite**: https://github.com/vitejs/vite
- **Nest CLI**: https://github.com/nestjs/nest-cli

### 文档与教程

- Commander.js: https://github.com/tj/commander.js
- Inquirer.js: https://github.com/SBoudrias/Inquirer.js
- Node.js CLI Apps Best Practices: https://github.com/lirantal/nodejs-cli-apps-best-practices

---

## 总结

开发一个优秀的 CLI 工具需要关注：

1. **易用性**：清晰的命令结构、友好的错误提示、渐进式参数处理
2. **健壮性**：完善的错误处理、输入验证、边界情况处理
3. **美观性**：彩色输出、加载动画、进度提示
4. **可维护性**：模块化设计、完善的测试、清晰的文档
5. **性能**：延迟加载、异步优化、合理缓存

遵循这些原则，就能开发出专业级的 CLI 工具。

---

**本指南基于实际项目经验总结，持续更新中。**
