import express from 'express';
import pool from '../config/db.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    console.log('GET /api/rooms - user:', req.user);
    const result = await pool.query(
      'SELECT id, room_code AS code, room_name AS name, room_type AS type, capacity, location, status FROM rooms ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { code, name, type, capacity, location, status } = req.body;
    if (!code || !name || !type || !capacity || !location) {
      return res.status(400).json({ message: 'Thiếu thông tin phòng học bắt buộc.' });
    }
    const duplicate = await pool.query('SELECT id FROM rooms WHERE room_code = $1', [code]);
    if (duplicate.rowCount > 0) {
      return res.status(409).json({ message: 'Mã phòng đã tồn tại.' });
    }
    const result = await pool.query(
      'INSERT INTO rooms (room_code, room_name, room_type, capacity, location, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, room_code AS code, room_name AS name, room_type AS type, capacity, location, status',
      [code, name, type, capacity, location, status || 'Hoạt động']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, name, type, capacity, location, status } = req.body;
    if (!code || !name || !type || !capacity || !location) {
      return res.status(400).json({ message: 'Thiếu thông tin phòng học bắt buộc.' });
    }
    const duplicate = await pool.query('SELECT id FROM rooms WHERE room_code = $1 AND id != $2', [code, id]);
    if (duplicate.rowCount > 0) {
      return res.status(409).json({ message: 'Mã phòng đã tồn tại.' });
    }
    const result = await pool.query(
      'UPDATE rooms SET room_code=$1, room_name=$2, room_type=$3, capacity=$4, location=$5, status=$6 WHERE id=$7 RETURNING id, room_code AS code, room_name AS name, room_type AS type, capacity, location, status',
      [code, name, type, capacity, location, status || 'Hoạt động', id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy phòng học.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const deviceCheck = await pool.query('SELECT id FROM devices WHERE room_id = $1 LIMIT 1', [id]);
    if (deviceCheck.rowCount > 0) {
      return res.status(400).json({ message: 'Không thể xóa phòng còn chứa thiết bị.' });
    }
    const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy phòng học.' });
    }
    res.json({ message: 'Xóa phòng học thành công.' });
  } catch (error) {
    next(error);
  }
});

export default router;
