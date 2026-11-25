const fs = require('fs');
const file = 'C:/smartdeal/smart-deal-backend/src/server.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /ORDER BY u\.created_at DESC`\s*\);/;
const replaceStr = `WHERE 
          (u.role = 'buyer') OR
          (u.role = 'seller' AND EXISTS (SELECT 1 FROM shops s WHERE s.owner_id = u.user_id AND s.status = 'approved')) OR
          (u.role = 'driver' AND EXISTS (SELECT 1 FROM riders r WHERE r.user_id = u.user_id AND r.status = 'approved')) OR
          (u.role NOT IN ('buyer', 'seller', 'driver'))
        ORDER BY u.created_at DESC\`;`;

if (content.match(regex)) {
  content = content.replace(regex, replaceStr);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Done!');
} else {
  console.log('Regex not found!');
}
