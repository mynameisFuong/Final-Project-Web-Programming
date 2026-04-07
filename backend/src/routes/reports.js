import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT dr.id, dr.device_id, d.device_code AS device_code, d.device_name AS device_name, d.room_id,
        u.full_name AS reporter_name, dr.description, dr.status, dr.created_at
       FROM damage_reports dr
       LEFT JOIN devices d ON d.id = dr.device_id
       LEFT JOIN users u ON u.id = dr.reporter_id
       ORDER BY dr.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { device_id, description } = req.body;
    if (!device_id || !description) {
      return res.status(400).json({ message: 'Thiếu thông tin báo hỏng bắt buộc.' });
    }
    const reporterId = req.user?.id;
    const result = await pool.query(
      'INSERT INTO damage_reports (device_id, reporter_id, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [device_id, reporterId, description, 'Chờ xử lý']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
