const fs = require('fs');
const path = 'C:/smartdeal/server.js';
let code = fs.readFileSync(path, 'utf8');

// Replace literal '\n' at the end of the file with actual newlines or remove it
if (code.endsWith('\\n')) {
  code = code.slice(0, -2);
}
if (code.includes('\\n')) {
  // If there are other literal \n that aren't inside strings... Actually just to be safe, only replace the one at the very end
}

// Another check, just remove it if it exists at the end
code = code.replace(/\\n\s*$/, '');
code = code.replace(/\\n\s*$/, '');

fs.writeFileSync(path, code);
console.log('Syntax fixed.');
