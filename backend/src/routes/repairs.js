import express from 'express';
import pool from '../config/db.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.device_id, d.device_code AS device_code, d.device_name AS device_name, d.room_id,
        u.full_name AS technician_name, r.repair_date, r.description, r.notes, r.created_at
       FROM repair_history r
       LEFT JOIN devices d ON d.id = r.device_id
       LEFT JOIN users u ON u.id = r.technician_id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', authorizeRoles('ADMIN', 'TECHNICIAN'), async (req, res, next) => {
  try {
    const { device_id, note } = req.body;
    if (!device_id || !note) {
      return res.status(400).json({ message: 'Thiếu thông tin sửa chữa bắt buộc.' });
    }
    const technicianId = req.user?.id;
    const repairDate = new Date().toISOString().slice(0, 10);
    const result = await pool.query(
      'INSERT INTO repair_history (device_id, technician_id, repair_date, description, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [device_id, technicianId, repairDate, note, '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
