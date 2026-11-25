const fs = require('fs');
const file = 'C:/smartdeal/smart-deal-app/src/app/(tabs)/profile.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\/\/ Fetch the local file as a Blob\r?\n\s*const fileRes = await fetch\(editAvatar\);\r?\n\s*const blob = await fileRes\.blob\(\);\r?\n\s*\r?\n\s*const formData = new FormData\(\);\r?\n\s*formData\.append\('avatar', blob, 'avatar\.jpg'\);/;

const newCode = `const formData = new FormData();
            formData.append('avatar', {
              uri: editAvatar,
              name: 'avatar.jpg',
              type: 'image/jpeg'
            });`;

if (regex.test(content)) {
    content = content.replace(regex, newCode);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Regex matched and replaced profile.tsx!');
} else {
    console.log('Regex did NOT match!');
}
