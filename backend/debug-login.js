import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function debug() {
  console.log('=== DEBUG LOGIN ===\n');

  // 1. Check DB connection
  console.log('1️⃣  Checking database connection...');
  const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connected\n');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message, '\n');
    process.exit(1);
  }

  // 2. Check users in DB
  console.log('2️⃣  Checking users in database...');
  try {
    const users = await pool.query('SELECT id, username, full_name, is_active FROM users LIMIT 5');
    if (users.rowCount === 0) {
      console.log('❌ No users found in database\n');
    } else {
      console.log(`Found ${users.rowCount} users:`);
      users.rows.forEach(u => {
        console.log(`  - ${u.username} (${u.full_name}) - active: ${u.is_active}`);
      });
      console.log();
    }
  } catch (err) {
    console.error('❌ Query failed:', err.message, '\n');
  }

  // 3. Test login with specific user
  console.log('3️⃣  Testing login endpoint...');
  try {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: '111111' })
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    if (response.ok) {
      console.log('✓ Login successful!\n');
    } else {
      console.log('❌ Login failed\n');
    }
  } catch (err) {
    console.error('❌ Login request failed:', err.message);
    console.error('Make sure backend is running on http://localhost:4000\n');
  }

  await pool.end();
  console.log('Done.');
}

debug();
