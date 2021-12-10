const fs = require('fs');
const path = require('path');

const { TextDecoder } = require('util')

const UNIT_REG = /([1-9]\d*\.?\d*|0\.\d*[1-9])(vw|vh)/g;
const findFiles = (dir, type) => {
  let result = [];
  
  let files = [];
  try {
    files = fs.readdirSync(dir);
  } catch(e) {
    console.log(`\x1b[41m Cannot find directory - ${dir} : ${e}`);
  }
  files.forEach((file) => {
    const filePath = `${dir}/${file}`;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const resultFiles = findFiles(filePath, type);
      result = result.concat(resultFiles);
    } else {
      
      if (type.includes(path.extname(file))) {
        result.push(filePath);
      }
    }
  })
  return result;
}

const transformStyleUnitToPx = (options) => {
  const { dir = ['.'], type = ['.html', '.css'], width = 375, height = 812} = options;
  const files = dir.reduce((acc, cur) => {
    return acc.concat(findFiles(cur, type));
  }, []);
  if (files.length >= 1) {
    console.log(`Start to convert files below:\n`);
    files.forEach(item => {
      const buffer = fs.readFileSync(item);
      const content = new TextDecoder().decode(buffer);
      if (UNIT_REG.test(content)) {
        console.log(`\x1b[34m ${item}\n`);
        const replacedContent = replaceContent(content, width, height);
        fs.writeFileSync(item, replacedContent);
      }
    });
    console.log(`\x1b[32m Convert success\n`);
  } 
}
const replaceContent = (content, width, height) => {
  const unitMap = {
    'vw': width,
    'vh': height
  };
  const result = content.replace(UNIT_REG, (m, $1, $2) => {
    const result = unit2px($1, unitMap[$2])
    return result;
  });
  return result;
}

const unit2px = (value, unit) => {
  const fixedValue = (Number(value) * (unit / 100)).toFixed(1);
  const result = parseInt(fixedValue) === Number(fixedValue) ? parseInt(fixedValue) : fixedValue;
  return result + 'px';
};

module.exports = transformStyleUnitToPx;

