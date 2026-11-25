const fs = require('fs');
const file = 'C:/smartdeal/smart-deal-app/src/app/(tabs)/profile.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `            // Fetch the local file as a Blob
            const fileRes = await fetch(editAvatar);
            const blob = await fileRes.blob();
            
            const formData = new FormData();
            formData.append('avatar', blob, 'avatar.jpg');`;

const newCode = `            const formData = new FormData();
            formData.append('avatar', {
              uri: editAvatar,
              name: 'avatar.jpg',
              type: 'image/jpeg'
            } as any);`;

if (content.includes('const blob = await fileRes.blob();')) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed profile.tsx successfully!');
} else {
    console.log('Code not found or already fixed.');
}
