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

(async () => {
  try {
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    console.log(res.rows.map((r) => r.table_name).join(', '));
    await client.end();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
