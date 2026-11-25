const fs = require('fs');
const file = 'C:/smartdeal/smart-deal-app/src/app/(tabs)/profile.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/type: 'image\/jpeg'\s*}\);/, "type: 'image/jpeg'\n            } as any);");
fs.writeFileSync(file, c);
console.log('Added as any: ' + c.includes('as any'));
