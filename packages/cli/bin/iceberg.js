#!/usr/bin/env node

const { run } = require('../dist/index.js');

run(process.argv).catch((error) => {
  console.error('Iceberg CLI 运行失败：', error.message);
  process.exit(1);
});
