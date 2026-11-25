import fs from 'fs';
const fp = 'C:/smartdeal/smart-deal-backend/src/server.js';
const content = fs.readFileSync(fp, 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes("app.put('/api/admin/shops/:id/approve',"));
const end = lines.indexOf('});', start);
const replacement = `app.put('/api/admin/shops/:id/approve', async (req, res) => {
  try {
    const shopId = req.params.id;
    const [result] = await db.execute(\`UPDATE shops SET status = "approved" WHERE shop_id = ?\`, [shopId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'ไม่พบร้านค้า' });
    const [shop] = await db.execute(\`SELECT owner_id FROM shops WHERE shop_id = ?\`, [shopId]);
    if (shop.length > 0) {
      await db.execute(\`UPDATE users SET role = "seller" WHERE user_id = ?\`, [shop[0].owner_id]);
    }
    res.json({ success: true, message: 'อนุมัติร้านค้าเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('API /api/admin/shops/:id/approve Error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});`;
lines.splice(start, end - start + 1, replacement);
fs.writeFileSync(fp, lines.join('\n'));
console.log('Fixed Backend 3!');
