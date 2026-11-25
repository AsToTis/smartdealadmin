const fs = require('fs');
const profileFile = 'C:/smartdeal/smart-deal-app/src/app/(tabs)/profile.tsx';
let profileContent = fs.readFileSync(profileFile, 'utf8');

const oldCode = \        try {
          const uploadRes = await axios.post(\\\\\\/users/\\\/avatar\\\, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (uploadRes.data?.success) {
            finalAvatarUrl = uploadRes.data.avatar_url;
          }
        } catch (uploadError) {
          console.error('Upload Error:', uploadError);
        }\;

const newCode = \        try {
          const uploadRes = await fetch(\\\\\\/users/\\\/avatar\\\, {
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
        }\;

profileContent = profileContent.replace(oldCode, newCode);
fs.writeFileSync(profileFile, profileContent, 'utf8');
console.log('Patched profile.tsx with fetch');
