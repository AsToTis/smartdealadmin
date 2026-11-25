const fs = require('fs');

const profileFile = 'C:/smartdeal/smart-deal-app/src/app/(tabs)/profile.tsx';
let profileContent = fs.readFileSync(profileFile, 'utf8');

const oldSave = `        try {
          const uploadRes = await axios.post(\`\${BASE_URL}/users/\${userId}/avatar\`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (uploadRes.data?.success) {
            finalAvatarUrl = uploadRes.data.avatar_url;
          }
        } catch (uploadError) {
          console.error('Upload Error:', uploadError);
        }`;
      
const newSave = `        try {
          const uploadRes = await fetch(\`\${BASE_URL}/users/\${userId}/avatar\`, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json',
            }
          });
          const uploadData = await uploadRes.json();
          if (uploadData?.success) {
            finalAvatarUrl = uploadData.avatar_url;
          } else {
             console.log('Upload failed with response:', uploadData);
          }
        } catch (uploadError) {
          console.error('Upload Error:', uploadError);
        }`;
      
profileContent = profileContent.replace(oldSave, newSave);

const formTypeFixOld = `        formData.append('avatar', {
          uri: editAvatar,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        } as any);`;

const formTypeFixNew = `        // React Native needs the name and type exactly like this for file upload
        formData.append('avatar', {
          uri: editAvatar,
          name: 'avatar.jpg',
          type: 'image/jpeg'
        } as any);`;

profileContent = profileContent.replace(formTypeFixOld, formTypeFixNew);

fs.writeFileSync(profileFile, profileContent, 'utf8');
console.log('Patched profile.tsx with fetch');
