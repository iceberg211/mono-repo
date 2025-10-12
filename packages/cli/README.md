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

---

## 开发指南

### 项目架构

```
packages/cli/
├── bin/
│   └── iceberg.js          # 可执行入口（shebang）
├── src/
│   ├── index.js            # 主程序（初始化 Commander）
│   ├── banner.js           # ASCII 艺术横幅
│   └── commands/
│       └── quicktype.js    # 子命令实现
└── package.json            # bin 字段配置
```

### 核心技术栈

| 依赖 | 用途 | 代码位置 |
|------|------|----------|
| **commander** | 命令行框架，解析参数和子命令 | `src/index.js:15-21` |
| **inquirer** | 交互式提示（列表选择、文本输入、编辑器）| `src/commands/quicktype.js:51-96` |
| **ora** | 终端加载动画 | `src/commands/quicktype.js:159` |
| **figlet** + **lolcatjs** | 彩色 ASCII 横幅 | `src/banner.js:6-7` |
| **shelljs** | 跨平台 shell 操作（文件检测、目录创建）| `src/commands/quicktype.js:71,168` |

### 开发新命令的完整流程

#### 1. 创建命令处理文件

在 `src/commands/` 下创建新文件，例如 `yourCommand.js`：

```javascript
const inquirer = require('inquirer');
const ora = require('ora');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

/**
 * 解析命令行参数，缺失时启动交互式提示
 */
async function resolveOptions(options) {
  let param1 = options.param1;

  // 参数缺失时交互式提示
  if (!param1) {
    const { inputValue } = await inquirer.prompt([
      {
        type: 'list',          // 单选列表
        name: 'inputValue',
        message: '请选择操作',
        choices: [
          { name: '选项 A', value: 'a' },
          { name: '选项 B', value: 'b' }
        ]
      }
    ]);
    param1 = inputValue;
  }

  return { param1 };
}

/**
 * 命令核心逻辑
 */
async function handleYourCommand(options) {
  // 1. 解析参数
  const { param1 } = await resolveOptions(options);

  // 2. 显示加载动画
  const spinner = ora('正在处理...').start();

  try {
    // 3. 执行核心逻辑
    const result = await doSomething(param1);

    spinner.succeed('处理完成');
    console.log('\n====== 结果 ======');
    console.log(result);
  } catch (error) {
    spinner.fail('处理失败');
    console.error(error.message);
    process.exitCode = 1;
  }
}

/**
 * 注册命令到 Commander 程序
 */
function registerYourCommand(program) {
  program
    .command('your-command')
    .description('命令描述说明')
    .option('-p, --param1 <value>', '参数说明')
    .option('-o, --output <path>', '输出路径')
    .action(async (options) => {
      await handleYourCommand(options);
    });
}

module.exports = { registerYourCommand };
```

#### 2. 在主程序中注册命令

编辑 `src/index.js`，导入并注册新命令：

```javascript
const { registerYourCommand } = require('./commands/yourCommand');

async function run(argv = process.argv) {
  printBanner();

  const program = new Command();
  program
    .name('iceberg')
    .description('Iceberg Monorepo 专用 CLI 工具')
    .version(pkg.version);

  registerQuicktypeCommand(program);
  registerYourCommand(program);  // 新增注册

  await program.parseAsync(argv);
}
```

#### 3. 测试命令

```bash
# 带参数测试
pnpm --filter @iceberg/cli exec iceberg your-command --param1 value

# 交互式测试（不传参数）
pnpm --filter @iceberg/cli exec iceberg your-command

# 查看帮助
pnpm --filter @iceberg/cli exec iceberg your-command --help
```

### 核心设计模式

#### 渐进式参数处理

遵循 **命令行参数 → 交互式提示 → 默认值** 的优先级：

```javascript
async function resolveOptions(options) {
  let value = options.input;  // 1. 优先使用命令行参数

  if (!value) {
    // 2. 参数缺失时启动交互式提示
    const { userInput } = await inquirer.prompt([
      {
        type: 'input',
        name: 'userInput',
        message: '请输入值',
        default: 'defaultValue',  // 3. 提供默认值
        validate: (input) => {
          // 自定义验证逻辑
          return input.trim() !== '' || '输入不能为空';
        }
      }
    ]);
    value = userInput;
  }

  return { value };
}
```

参考 `src/commands/quicktype.js:45-155` 查看完整实现。

#### Inquirer 常用提示类型

```javascript
// 单选列表
{
  type: 'list',
  name: 'choice',
  message: '请选择',
  choices: [
    { name: '显示名称', value: 'actualValue' }
  ]
}

// 文本输入
{
  type: 'input',
  name: 'text',
  message: '请输入',
  default: '默认值',
  validate: (input) => input.trim() !== '' || '不能为空'
}

// 确认提示
{
  type: 'confirm',
  name: 'confirmed',
  message: '是否继续？',
  default: false
}

// 编辑器（适合多行 JSON）
{
  type: 'editor',
  name: 'content',
  message: '请粘贴 JSON',
  validate: (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return 'JSON 格式错误';
    }
  }
}
```

#### 用户体验优化

**1. 加载动画（参考 `src/commands/quicktype.js:159-178`）**

```javascript
const spinner = ora('正在生成类型...').start();
try {
  // 耗时操作
  spinner.succeed('生成完成');
} catch (error) {
  spinner.fail('生成失败');
  console.error(error.message);
}
```

**2. 彩色横幅（参考 `src/banner.js`）**

```javascript
const figlet = require('figlet');
const lolcat = require('@darkobits/lolcatjs');

function printBanner() {
  const asciiArt = figlet.textSync('Iceberg CLI', { font: 'Slant' });
  console.log(lolcat.fromString(asciiArt));
}
```

**3. 文件操作（参考 `src/commands/quicktype.js:166-170`）**

```javascript
const shell = require('shelljs');
const fs = require('fs');

// 检查文件是否存在
if (shell.test('-f', filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
}

// 创建目录并写入文件
const targetDir = path.dirname(outputPath);
shell.mkdir('-p', targetDir);
fs.writeFileSync(outputPath, content, 'utf8');
```

### 错误处理规范

```javascript
async function handleCommand(options) {
  try {
    // 业务逻辑
  } catch (error) {
    console.error(`错误：${error.message}`);
    process.exitCode = 1;  // 设置退出码（非零表示失败）
  }
}
```

顶层入口 `bin/iceberg.js` 会捕获未处理的异常：

```javascript
run(process.argv).catch((error) => {
  console.error('CLI 运行失败：', error.message);
  process.exit(1);
});
```

### 最佳实践

1. **模块化设计**：每个命令独立文件，避免 `index.js` 臃肿
2. **友好的交互**：支持完整命令行参数，也支持纯交互式操作
3. **详细的提示**：使用 Inquirer 的 `message` 和 `validate` 提供清晰反馈
4. **进度可视化**：耗时操作使用 `ora` 显示加载状态
5. **错误容错**：文件不存在、格式错误等边界情况要有明确提示
6. **CommonJS 模式**：CLI 包不使用 TypeScript/ESM，保持最大兼容性

### 参考资料

- Commander.js: https://github.com/tj/commander.js
- Inquirer.js: https://github.com/SBoudrias/Inquirer.js
- Ora: https://github.com/sindresorhus/ora
- Figlet: https://github.com/patorjk/figlet.js
