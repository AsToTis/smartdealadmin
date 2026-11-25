const fs = require('fs');
const filePath = 'C:\\smartdeal\\smart-deal-backend\\src\\server.js';
try {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /r\.license_plate,/g,
    'r.vehicle_plate as license_plate,'
  );
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched server.js');
} catch (e) {
  console.error('Error patching server.js:', e.message);
}
