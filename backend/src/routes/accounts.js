import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, username, full_name, email, role,
        CASE WHEN is_active THEN 'ACTIVE' ELSE 'LOCKED' END AS status
       FROM users ORDER BY id`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { username, password, full_name, email, role } = req.body;
    if (!username || !password || !full_name || !email || !role) {
      return res.status(400).json({ message: 'Thiếu thông tin tài khoản bắt buộc.' });
    }
    const duplicate = await pool.query('SELECT id FROM users WHERE username = $1', [username.trim()]);
    if (duplicate.rowCount > 0) {
      return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, password_hash, full_name, email, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, full_name, email, role,
         CASE WHEN is_active THEN 'ACTIVE' ELSE 'LOCKED' END AS status`,
      [username.trim(), hash, full_name, email, role, true]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, email, role } = req.body;
    if (!full_name || !email || !role) {
      return res.status(400).json({ message: 'Thiếu thông tin cập nhật tài khoản.' });
    }
    const result = await pool.query(
      `UPDATE users SET full_name=$1, email=$2, role=$3 WHERE id=$4
       RETURNING id, username, full_name, email, role,
         CASE WHEN is_active THEN 'ACTIVE' ELSE 'LOCKED' END AS status`,
      [full_name, email, role, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/lock', authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = await pool.query('SELECT is_active FROM users WHERE id = $1', [id]);
    if (current.rowCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
    }
    const nextStatus = !current.rows[0].is_active;
    const result = await pool.query(
      `UPDATE users SET is_active = $1 WHERE id = $2
       RETURNING id, username, full_name, email, role,
         CASE WHEN is_active THEN 'ACTIVE' ELSE 'LOCKED' END AS status`,
      [nextStatus, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
