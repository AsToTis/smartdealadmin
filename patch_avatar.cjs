const fs = require('fs');

const serverFile = 'C:/smartdeal/smart-deal-backend/src/server.js';
let serverContent = fs.readFileSync(serverFile, 'utf8');

if (!serverContent.includes('app.post(\'/api/users/:id/avatar\'')) {
  serverContent = serverContent.replace(
    /\/\/ เปลี่ยนรหัสผ่าน \(PUT \/api\/users\/:id\/change-password\)/g,
    `// อัปโหลดรูปโปรไฟล์ (POST /api/users/:id/avatar)
app.post('/api/users/:id/avatar', upload.single('avatar'), async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'ไม่มีไฟล์' });
    }
    const avatarUrl = '/uploads/' + req.file.filename;
    await db.execute('UPDATE users SET avatar_url = ? WHERE user_id = ?', [avatarUrl, id]);
    res.json({ success: true, avatar_url: avatarUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// เปลี่ยนรหัสผ่าน (PUT /api/users/:id/change-password)`
  );
  fs.writeFileSync(serverFile, serverContent, 'utf8');
  console.log('Patched server.js');
}

const profileFile = 'C:/smartdeal/smart-deal-app/src/app/(tabs)/profile.tsx';
let profileContent = fs.readFileSync(profileFile, 'utf8');

if (!profileContent.includes('FormData()')) {
  const oldSave = `      const response = await axios.put(\`\${BASE_URL}/users/\${userId}/profile\`, {
        full_name: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
        avatar_url: editAvatar || null
      });`;
      
  const newSave = `      let finalAvatarUrl = editAvatar;

      if (editAvatar && editAvatar.startsWith('file://')) {
        const formData = new FormData();
        formData.append('avatar', {
          uri: editAvatar,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        } as any);
        
        try {
          const uploadRes = await axios.post(\`\${BASE_URL}/users/\${userId}/avatar\`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (uploadRes.data?.success) {
            finalAvatarUrl = uploadRes.data.avatar_url;
          }
        } catch (uploadError) {
          console.error('Upload Error:', uploadError);
        }
      }

      const response = await axios.put(\`\${BASE_URL}/users/\${userId}/profile\`, {
        full_name: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
        avatar_url: finalAvatarUrl || null
      });`;
      
  profileContent = profileContent.replace(oldSave, newSave);
  fs.writeFileSync(profileFile, profileContent, 'utf8');
  console.log('Patched profile.tsx');
}
