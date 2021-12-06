#! /usr/bin/env node

const commander = require('commander');

const program = new commander.Command();

program
  .version(require('../package.json').version)
  .name('unit2px')
  .option('-d, --dir <dir...>', 'directory to be convert (default: [__dirname])')
  .option('-t, --type <type...>', `file types to be convert (default: ['.html', '.css'])`)
  .option('-w, --width <width>', 'client width (default: 375)')
  .option('-h, --height <height>', 'client height (default: 812)')
  .action((option = {}) => {
    require('../lib/index.js')(option)
  })


program.parse(process.argv);
