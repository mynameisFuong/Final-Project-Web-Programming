import bcrypt from 'bcrypt';
import readline from 'readline';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  console.log('=== Password Hash Generator ===\n');
  
  const choice = await prompt('Chọn:\n1. Chỉ hash password (không lưu DB)\n2. Hash và cập nhật vào database\n\nLựa chọn (1/2): ');
  
  if (choice === '1') {
    const password = await prompt('Nhập mật khẩu cần hash: ');
    const hash = await bcrypt.hash(password, 10);
    console.log('\nPassword hash:');
    console.log(hash);
    console.log('\nCopy hash này và UPDATE vào cột password_hash trong bảng users.');
    rl.close();
  } else if (choice === '2') {
    const username = await prompt('Nhập username: ');
    const password = await prompt('Nhập mật khẩu mới: ');
    
    try {
      console.log('\n⏳ Đang hash password...');
      const hash = await bcrypt.hash(password, 10);
      console.log('Password hash:', hash);
      
      console.log('\n⏳ Kết nối database...');
      const pool = new pg.Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
      
      console.log('⏳ Cập nhật database...');
      const result = await pool.query('UPDATE users SET password_hash = $1 WHERE username = $2', [hash, username]);
      
      if (result.rowCount === 0) {
        console.log(`\n❌ Không tìm thấy user "${username}" trong database.`);
      } else {
        console.log(`\n✓ Cập nhật mật khẩu cho user "${username}" thành công.`);
      }
      
      await pool.end();
    } catch (error) {
      console.error('\n❌ Lỗi:', error.message);
      console.error('Chi tiết:', error);
    }
    rl.close();
  } else {
    console.log('Lựa chọn không hợp lệ.');
    rl.close();
  }
}

main();
