import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  const username = 'admin';
  const password = 'Admin@123';
  const fullName = 'Administrator';
  const email = 'admin@school.edu';
  const role = 'ADMIN';

  try {
    console.log('🔐 Hashing password...');
    const hash = await bcrypt.hash(password, 10);
    console.log(`✓ Password hash: ${hash}\n`);

    console.log('📊 Connecting to database...');
    const pool = new pg.Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Check if admin already exists
    console.log(`⏳ Kiểm tra user "${username}" đã tồn tại chưa...`);
    const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    
    if (existing.rowCount > 0) {
      console.log(`❌ User "${username}" đã tồn tại trong database.\n`);
      console.log('Cập nhật password cho user hiện tại...');
      await pool.query('UPDATE users SET password_hash = $1 WHERE username = $2', [hash, username]);
      console.log(`✓ Cập nhật mật khẩu thành công!\n`);
    } else {
      console.log(`✓ User "${username}" chưa tồn tại. Tạo user mới...\n`);
      await pool.query(
        'INSERT INTO users (username, password_hash, full_name, email, role, is_active) VALUES ($1, $2, $3, $4, $5, $6)',
        [username, hash, fullName, email, role, true]
      );
      console.log(`✓ Tạo user "${username}" thành công!\n`);
    }

    console.log('📋 Thông tin đăng nhập:');
    console.log(`  Username: ${username}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role: ${role}`);
    console.log(`  is_active: true\n`);

    await pool.end();
    console.log('✅ Hoàn tất!');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

createAdmin();
