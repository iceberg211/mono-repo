const os = require('os');
const { Command } = require('commander');
const { printBanner } = require('./banner');
const { registerQuicktypeCommand } = require('./commands/quicktype');
const pkg = require('../package.json');

async function run(argv = process.argv) {
  printBanner();
  console.log(`当前平台：${os.platform()} · 架构：${os.arch()}`);
  const cpu = os.cpus()[0];
  if (cpu) {
    console.log(`主要 CPU：${cpu.model}`);
  }

  const program = new Command();
  program
    .name('iceberg')
    .description('Iceberg Monorepo 专用 CLI 工具')
    .version(pkg.version);

  registerQuicktypeCommand(program);

  await program.parseAsync(argv);
}

module.exports = { run };
