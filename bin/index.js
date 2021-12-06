#! /usr/bin/env node

const commander = require('commander');

const program = new commander.Command();

program
  .version(require('../package.json').version)
  .name('unit2px')
  .option('-d, --dir <dir...>', '需要执行命令的文件夹路径')
  .option('-t, --type <type...>', '需要执行命令的文件名后缀，默认 .html, .css')
  .option('-w, --width <width>', '要转换的视口宽度')
  .option('-h, --height <height>', '要转换的视口高度')
  .action((option) => {
    require('../lib/index.js')(option)
  })


program.parse(process.argv);
