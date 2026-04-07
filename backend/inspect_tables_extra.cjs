const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const tables = ['damage_reports', 'repair_history', 'device_types'];

(async () => {
  try {
    await client.connect();
    for (const t of tables) {
      const res = await client.query(`SELECT table_name, column_name FROM information_schema.columns WHERE table_name = '${t}' ORDER BY ordinal_position`);
      console.log('---', t, '---');
      console.log(res.rows.map((r) => r.column_name).join(', '));
    }
    await client.end();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
