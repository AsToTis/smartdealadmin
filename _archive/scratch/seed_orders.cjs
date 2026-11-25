const mysql = require('mysql2/promise');

async function run() {
  console.log('Connecting to database...');
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_deal_db'
  });

  const shops = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const users = [8, 22, 2, 18, 19, 9, 23, 20, 10, 24, 11, 21, 25, 12, 13, 14, 15, 1, 16, 5, 7, 3, 4];
  
  console.log('Seeding 1000 orders...');
  
  let inserted = 0;
  
  for (let i = 0; i < 1000; i++) {
    const shop_id = shops[Math.floor(Math.random() * shops.length)];
    const user_id = users[Math.floor(Math.random() * users.length)];
    const subtotal = Math.floor(Math.random() * 450) + 50; // 50 to 500
    const delivery_fee = Math.floor(Math.random() * 40) + 10; // 10 to 50
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0;
    const total_amount = subtotal + delivery_fee - discount;
    
    // random date in the last 30 days
    const dateOffset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
    const created_at = new Date(Date.now() - dateOffset);
    
    const query = `
      INSERT INTO orders (user_id, shop_id, subtotal, delivery_fee, discount, total_amount, order_status, delivery_type, payment_method, receiver_name, receiver_phone, shipping_address, created_at, order_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.execute(query, [
      user_id,
      shop_id,
      subtotal,
      delivery_fee,
      discount,
      total_amount,
      'delivered',
      'delivery',
      'promptpay',
      'Mock User',
      '0800000000',
      'Mock Address',
      created_at,
      'normal'
    ]);
    
    inserted++;
  }
  
  console.log(`Successfully seeded ${inserted} orders!`);
  process.exit();
}

run().catch(console.error);
