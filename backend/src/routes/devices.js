import express from 'express';
import pool from '../config/db.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

async function resolveDeviceType(typeName) {
  if (!typeName) return null;
  const normalized = typeName.trim();
  const existing = await pool.query('SELECT id FROM device_types WHERE type_name ILIKE $1 LIMIT 1', [normalized]);
  if (existing.rowCount > 0) {
    return existing.rows[0].id;
  }
  const inserted = await pool.query('INSERT INTO device_types (type_name, description) VALUES ($1, $2) RETURNING id', [normalized, '']);
  return inserted.rows[0].id;
}

router.get('/', async (req, res, next) => {
  try {
    const { roomId } = req.query;
    console.log('GET /api/devices - user:', req.user, 'roomId:', roomId);
    const baseQuery = `SELECT d.id, d.room_id, d.device_code AS code, d.device_name AS name, dt.type_name AS type,
      d.status, d.entry_date AS imported_date, d.description
      FROM devices d
      LEFT JOIN device_types dt ON dt.id = d.device_type_id`;
    const query = roomId ? `${baseQuery} WHERE d.room_id = $1 ORDER BY d.id` : `${baseQuery} ORDER BY d.id`;
    const values = roomId ? [roomId] : [];
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { code, name, type, status, imported_date, description, room_id } = req.body;
    if (!code || !name || !type || !imported_date || !room_id) {
      return res.status(400).json({ message: 'Thiếu thông tin thiết bị bắt buộc.' });
    }

    const duplicate = await pool.query('SELECT id FROM devices WHERE device_code = $1', [code]);
    if (duplicate.rowCount > 0) {
      return res.status(409).json({ message: 'Mã thiết bị đã tồn tại.' });
    }

    const typeId = await resolveDeviceType(type);
    const result = await pool.query(
      'INSERT INTO devices (room_id, device_type_id, device_code, device_name, status, entry_date, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, room_id, device_code AS code, device_name AS name, $8 AS type, status, entry_date AS imported_date, description',
      [room_id, typeId, code, name, status || 'Tốt', imported_date, description || '', type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, name, type, status, imported_date, description, room_id } = req.body;
    if (!code || !name || !type || !imported_date || !room_id) {
      return res.status(400).json({ message: 'Thiếu thông tin thiết bị bắt buộc.' });
    }
    const duplicate = await pool.query('SELECT id FROM devices WHERE device_code = $1 AND id != $2', [code, id]);
    if (duplicate.rowCount > 0) {
      return res.status(409).json({ message: 'Mã thiết bị đã tồn tại.' });
    }
    const typeId = await resolveDeviceType(type);
    const result = await pool.query(
      'UPDATE devices SET room_id=$1, device_type_id=$2, device_code=$3, device_name=$4, status=$5, entry_date=$6, description=$7 WHERE id=$8 RETURNING id, room_id, device_code AS code, device_name AS name, $9 AS type, status, entry_date AS imported_date, description',
      [room_id, typeId, code, name, status || 'Tốt', imported_date, description || '', id, type]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM devices WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị.' });
    }
    res.json({ message: 'Xóa thiết bị thành công.' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', authorizeRoles('ADMIN', 'TECHNICIAN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Thiếu trạng thái mới.' });
    }
    const result = await pool.query('UPDATE devices SET status = $1 WHERE id = $2 RETURNING id, room_id, device_code AS code, device_name AS name, status, entry_date AS imported_date, description', [status, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
