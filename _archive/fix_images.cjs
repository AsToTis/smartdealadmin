const fs = require('fs');
let content = fs.readFileSync('c:/smartdealadmin/src/pages/Shops.jsx', 'utf8');

// Fix shop image
content = content.replace(
  /"http:\/\/localhost:5000\$\(\{shopInsights\.shop\.image_url\}\)"/g,
  "\http://localhost:5000\\"
);

// Fix product images (2 occurrences: list and details modal)
content = content.replace(
  /"http:\/\/localhost:5000\$\(\{product\.image_url\}\)"/g,
  "\http://localhost:5000\\"
);

content = content.replace(
  /"http:\/\/localhost:5000\$\(\{selectedProduct\.image_url\}\)"/g,
  "\http://localhost:5000\\"
);

fs.writeFileSync('c:/smartdealadmin/src/pages/Shops.jsx', content, 'utf8');