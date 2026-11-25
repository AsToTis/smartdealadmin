const fs = require('fs');
const file = 'C:/smartdeal/smart-deal-app/src/app/(tabs)/profile.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace("Platform.OS === 'ios' ? editAvatar.replace('file://', '') : editAvatar", "editAvatar");
fs.writeFileSync(file, c);
console.log('Reverted iOS file URI hack: ' + !c.includes('editAvatar.replace'));
