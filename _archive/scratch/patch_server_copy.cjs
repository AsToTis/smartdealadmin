const fs = require('fs');
const file = 'c:/smartdealadmin/server_copy.js';
let content = fs.readFileSync(file, 'utf8');

const target1 = '// เปลี่ยนรหัสผ่าน (PUT /api/users/:id/change-password)\napp.put(\'/api/users/:id/change-password\', async (req, res) => {';
const target2 = '// เปลี่ยนรหัสผ่าน (PUT /api/users/:id/change-password)\r\napp.put(\'/api/users/:id/change-password\', async (req, res) => {';

const replacement = `// อัปโหลดรูปโปรไฟล์ (POST /api/users/:id/avatar)
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
});\n\n// เปลี่ยนรหัสผ่าน (PUT /api/users/:id/change-password)\napp.put('/api/users/:id/change-password', async (req, res) => {`;

if (content.includes('// อัปโหลดรูปโปรไฟล์ (POST /api/users/:id/avatar)')) {
    console.log('Already added!');
} else {
    if (content.includes(target1)) {
        content = content.replace(target1, replacement);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Added avatar endpoint successfully!');
    } else if (content.includes(target2)) {
        content = content.replace(target2, replacement);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Added avatar endpoint successfully!');
    } else {
        console.log('Target not found!');
    }
}
