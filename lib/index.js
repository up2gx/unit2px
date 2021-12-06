const fs = require('fs');
const path = require('path');

const { TextDecoder } = require('util')

const findFiles = (dir, type) => {
  let result = [];
  
  const files = fs.readdirSync(dir);
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
  const { dir = [__dirname], type = ['.html', '.css'], width = 375, height = 812} = options;

  const files = dir.reduce((acc, cur) => {
    return acc.concat(findFiles(cur, type));
  }, []);

  files.forEach(item => {
    const buffer = fs.readFileSync(item);
    const content = new TextDecoder().decode(buffer);
    const replacedContent = replaceContent(content, width, height);
    fs.writeFileSync(item, replacedContent);
  });
}
const replaceContent = (content, width, height) => {
  const unitReg = /([1-9]\d*\.?\d*|0\.\d*[1-9])(vw|vh)/g;
  const unitMap = {
    'vw': width,
    'vh': height
  };
  const result = content.replace(unitReg, (m, $1, $2) => {
    const result = unit2px($1, unitMap[$2])
    return result;
  });
  return result;
}

const unit2px = (value, unit) => {
  const fixedValue = (Number(value) * (unit / 100)).toFixed(1);
  const result = parseInt(fixedValue) === Number(fixedValue) ? parseInt(fixedValue) : fixedValue;
  console.log('result', result);
  return result + 'px';
};


module.exports = transformStyleUnitToPx;

