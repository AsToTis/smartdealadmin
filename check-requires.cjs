const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules')) {
        results = results.concat(walk(file));
      }
    } else if (file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('C:/smartdeal/smart-deal-backend');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/require\(['"](\.[^'"]+)['"]\)/g);
  if (matches) {
    matches.forEach(m => {
      console.log(`${f} -> ${m}`);
    });
  }
});
