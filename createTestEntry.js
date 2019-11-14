/* eslint-env node */
const fs = require('fs');
const glob = require('glob');

module.exports = () => {
  const files = glob.sync('src/**/*.spec.js').sort();
  const output = files.map(file => `import '../${file}';`).join('\n');
  fs.writeFileSync('./src/testEntry.js', output);
};
