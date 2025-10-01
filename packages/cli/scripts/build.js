#!/usr/bin/env node

/**
 * 构建流程：将 src 与 bin 拷贝到 dist 目录，以便后续打包或发布。
 */
const path = require('path');
const shell = require('shelljs');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

shell.rm('-rf', distDir);
shell.mkdir('-p', distDir);
shell.cp('-R', path.join(rootDir, 'src'), distDir);
shell.cp('-R', path.join(rootDir, 'bin'), distDir);

const distBin = path.join(distDir, 'bin', 'iceberg.js');
shell.chmod('+x', distBin);

console.log('构建完成：dist 目录已更新');
