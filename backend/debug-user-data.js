import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function debug() {
  console.log('=== CHECK ROOMS & DEVICES ===\n');

  const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('1️⃣  Checking rooms in database...');
    const rooms = await pool.query('SELECT id, room_code, room_name FROM rooms LIMIT 5');
    console.log(`Found ${rooms.rowCount} rooms:`);
    rooms.rows.forEach(r => {
      console.log(`  - ${r.room_code}: ${r.room_name}`);
    });
    console.log();

    console.log('2️⃣  Checking devices in database...');
    const devices = await pool.query('SELECT id, device_code, device_name FROM devices LIMIT 5');
    console.log(`Found ${devices.rowCount} devices:`);
    devices.rows.forEach(d => {
      console.log(`  - ${d.device_code}: ${d.device_name}`);
    });
    console.log();

    console.log('3️⃣  Testing API endpoints...');
    
    // Get token first (login as loptruong_dtvt2)
    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'loptruong_dtvt2', password: '111111' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      console.error('Login failed:', loginData);
      await pool.end();
      return;
    }
    const token = loginData.token;
    console.log('✓ Token obtained\n');

    // Test GET /api/rooms
    const roomsRes = await fetch('http://localhost:4000/api/rooms', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const roomsAPI = await roomsRes.json();
    console.log(`GET /api/rooms - Status: ${roomsRes.status}`);
    console.log(`  Result: ${Array.isArray(roomsAPI) ? roomsAPI.length + ' rooms' : roomsAPI.message}`);
    console.log();

    // Test GET /api/devices
    const devicesRes = await fetch('http://localhost:4000/api/devices', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const devicesAPI = await devicesRes.json();
    console.log(`GET /api/devices - Status: ${devicesRes.status}`);
    console.log(`  Result: ${Array.isArray(devicesAPI) ? devicesAPI.length + ' devices' : devicesAPI.message}`);

  } catch (err) {
    console.error('Error:', err.message);
  }

  await pool.end();
  console.log('\nDone.');
}

debug();
