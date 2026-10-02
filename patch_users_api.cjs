const fs = require('fs');
const file = 'C:/smartdeal/smart-deal-backend/src/server.js';
let content = fs.readFileSync(file, 'utf8');

const oldQ = `      END as performance_score
        FROM users u 
        ORDER BY u.created_at DESC\``;

const newQ = `      END as performance_score
        FROM users u 
        WHERE 
          (u.role = 'buyer') OR
          (u.role = 'seller' AND EXISTS (SELECT 1 FROM shops s WHERE s.owner_id = u.user_id AND s.status = 'approved')) OR
          (u.role = 'driver' AND EXISTS (SELECT 1 FROM riders r WHERE r.user_id = u.user_id AND r.status = 'approved')) OR
          (u.role NOT IN ('buyer', 'seller', 'driver'))
        ORDER BY u.created_at DESC\``;

if (content.includes(oldQ)) {
  content = content.replace(oldQ, newQ);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Patched API GET /api/admin/users successfully!');
} else {
  console.log('API already patched or string not found.');
}
