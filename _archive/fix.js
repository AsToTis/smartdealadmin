const fs = require('fs');
let content = fs.readFileSync('c:/smartdealadmin/src/pages/Shops.jsx', 'utf8');
content = content.replace(
  "className={px-2.5 py-0.5 rounded-full text-xs font-medium ${shopInsights.shop.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}}",
  "className={\px-2.5 py-0.5 rounded-full text-xs font-medium \\}"
);
fs.writeFileSync('c:/smartdealadmin/src/pages/Shops.jsx', content, 'utf8');