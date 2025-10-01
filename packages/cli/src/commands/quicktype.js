const fs = require('fs');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');
const ora = require('ora');
const shell = require('shelljs');
const { quicktype, InputData, jsonInputForTargetLanguage } = require('quicktype-core');

const toPascalCase = (value) => {
  return value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') || 'ApiResponse';
};

const toKebabCase = (value) => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'api-response';
};

async function buildTypeDefinitions(jsonString, typeName) {
  const jsonInput = jsonInputForTargetLanguage('ts');
  await jsonInput.addSource({ name: typeName, samples: [jsonString] });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const result = await quicktype({
    inputData,
    lang: 'ts',
    rendererOptions: {
      'just-types': 'true'
    }
  });

  return result.lines.join('\n');
}

async function resolveOptions(options) {
  let jsonString = options.input;
  let typeName = options.name;
  let outputPath = options.output;

  if (!jsonString) {
    const { source } = await inquirer.prompt([
      {
        type: 'list',
        name: 'source',
        message: '请选择 JSON 数据来源',
        choices: [
          { name: '粘贴 JSON 字符串', value: 'json' },
          { name: '读取本地文件', value: 'file' }
        ]
      }
    ]);

    if (source === 'file') {
      const { filePath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'filePath',
          message: '请输入包含接口返回的文件路径',
          validate: (inputPath) => {
            const resolvedPath = path.resolve(process.cwd(), inputPath.trim());
            if (shell.test('-f', resolvedPath)) {
              return true;
            }
            return '未找到指定文件，请重新输入';
          }
        }
      ]);
      const resolved = path.resolve(process.cwd(), filePath.trim());
      jsonString = fs.readFileSync(resolved, 'utf8');
    } else {
      const { jsonContent } = await inquirer.prompt([
        {
          type: 'editor',
          name: 'jsonContent',
          message: '请粘贴接口返回的 JSON 数据',
          validate: (content) => {
            try {
              JSON.parse(content.trim());
              return true;
            } catch (error) {
              return `JSON 解析失败：${error.message}`;
            }
          }
        }
      ]);
      jsonString = jsonContent.trim();
    }
  } else {
    const candidatePath = path.resolve(process.cwd(), jsonString.trim());
    if (shell.test('-f', candidatePath)) {
      jsonString = fs.readFileSync(candidatePath, 'utf8');
    }
  }

  if (!typeName) {
    const { inputName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'inputName',
        message: '请输入生成的主类型名称',
        default: 'ApiResponse'
      }
    ]);
    typeName = inputName;
  }

  const normalizedName = toPascalCase(typeName);

  try {
    JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`JSON 数据无效：${error.message}`);
  }

  if (!outputPath) {
    const { saveToFile } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'saveToFile',
        message: '是否将结果写入文件？',
        default: false
      }
    ]);

    if (saveToFile) {
      const defaultDir = path.join(os.homedir(), 'iceberg-types');
      const defaultFile = path.join(defaultDir, `${toKebabCase(normalizedName)}.d.ts`);
      const { targetPath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'targetPath',
          message: '请输入输出文件路径',
          default: defaultFile
        }
      ]);
      outputPath = targetPath.trim();
    }
  }

  return {
    jsonString,
    typeName: normalizedName,
    outputPath
  };
}

async function handleQuicktype(options) {
  const resolved = await resolveOptions(options);
  const spinner = ora('正在生成 TypeScript 类型...').start();

  try {
    const typeDefinitions = await buildTypeDefinitions(resolved.jsonString, resolved.typeName);
    spinner.succeed('类型生成完成');

    if (resolved.outputPath) {
      const resolvedPath = path.resolve(process.cwd(), resolved.outputPath);
      const targetDir = path.dirname(resolvedPath);
      shell.mkdir('-p', targetDir);
      fs.writeFileSync(resolvedPath, typeDefinitions, 'utf8');
      console.log(`已将类型写入文件：${resolvedPath}`);
    }

    console.log('\n====== 生成结果 ======');
    console.log(typeDefinitions);
  } catch (error) {
    spinner.fail('生成类型时出现错误');
    console.error(error.message);
    process.exitCode = 1;
  }
}

function registerQuicktypeCommand(program) {
  program
    .command('quicktype')
    .description('使用 quicktype-core 将接口 JSON 转换为 TypeScript 类型')
    .option('-i, --input <input>', 'JSON 字符串或文件路径')
    .option('-n, --name <typeName>', '生成的主类型名称')
    .option('-o, --output <output>', '输出文件路径')
    .action(async (options) => {
      await handleQuicktype(options);
    });
}

module.exports = { registerQuicktypeCommand };
