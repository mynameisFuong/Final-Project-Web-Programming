import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '8h';

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập username và password.' });
    }

    const result = await pool.query(
      'SELECT id, username, password_hash, full_name, role, is_active AS status FROM users WHERE username = $1',
      [username]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
    if (!user.status) {
      return res.status(403).json({ message: 'Tài khoản đang bị khóa. Liên hệ Admin.' });
    }

    const matched = await bcrypt.compare(password, user.password_hash);
    if (!matched) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      fullName: user.full_name
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

    res.json({ token, user: payload });
  } catch (error) {
    next(error);
  }
});

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
