import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = process.env.API_BASE || 'http://localhost:4000/api';

async function tryLogin(username, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: { message: err.message } };
  }
}

async function probeWithToken(token) {
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const r1 = await fetch(`${API_BASE}/rooms`, { headers });
    const rooms = await r1.json().catch(() => null);
    const r2 = await fetch(`${API_BASE}/devices`, { headers });
    const devices = await r2.json().catch(() => null);
    return {
      roomsStatus: r1.status,
      rooms: Array.isArray(rooms) ? rooms.length : JSON.stringify(rooms),
      roomsArray: rooms,
      devicesStatus: r2.status,
      devices: Array.isArray(devices) ? devices.length : JSON.stringify(devices),
      devicesArray: devices
    };
  } catch (err) {
    return { error: err.message };
  }
}

async function main() {
  console.log('=== User scan and API probe ===\n');
  const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const usersRes = await pool.query('SELECT username, role FROM users ORDER BY id');
  const users = usersRes.rows.map(r => ({ username: r.username, role: r.role }));
  console.log('Found users in DB:', users.map(u => `${u.username}(${u.role})`).join(', '), '\n');

  // include the common passwords and the one you provided
  const passwordsToTry = ['123456','111111', 'Admin@123', 'Tech@123', 'User@123', 'Pass@123'];

  for (const u of users) {
    console.log('---');
    console.log('Testing user:', u.username, 'role:', u.role);
    let success = false;
    for (const p of passwordsToTry) {
      const res = await tryLogin(u.username, p);
      if (res.ok && res.data && res.data.token) {
        console.log(`  ✅ Login success with password: ${p}`);
        const probe = await probeWithToken(res.data.token);
        console.log('  Rooms:', probe.roomsStatus, probe.rooms);
        if (Array.isArray(probe.roomsArray) && probe.roomsArray.length) {
          console.log('    Sample room:', JSON.stringify(probe.roomsArray[0]));
        } else {
          console.log('    Room payload:', probe.roomsArray);
        }
        console.log('  Devices:', probe.devicesStatus, probe.devices);
        if (Array.isArray(probe.devicesArray) && probe.devicesArray.length) {
          console.log('    Sample device:', JSON.stringify(probe.devicesArray[0]));
        } else {
          console.log('    Device payload:', probe.devicesArray);
        }
        success = true;
        break;
      } else {
        console.log(`  - try ${p} => ${res.status} ${res.data?.message || ''}`);
      }
    }
    if (!success) console.log('  ❌ No tested password worked for', u.username);
  }

  await pool.end();
  console.log('\nDone.');
}

main().catch(e => { console.error('Fatal error', e); process.exit(1); });
