const fs = require('fs');
const file = 'C:/smartdeal/smart-deal-app/src/app/(tabs)/profile.tsx';
let c = fs.readFileSync(file, 'utf8');
const newCode = `          const uploadData = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', \`\${BASE_URL}/users/\${userId}/avatar\`);
            xhr.onload = () => {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve(data);
              } catch (e) {
                reject(e);
              }
            };
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.send(formData);
          });`;

c = c.replace(/const uploadRes = await fetch[\s\S]*?await uploadRes\.json\(\);/, newCode);
fs.writeFileSync(file, c);
console.log('Patched XMLHttpRequest: ' + c.includes('XMLHttpRequest'));
