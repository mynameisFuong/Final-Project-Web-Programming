import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';

export function authenticateToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Thiếu token xác thực.' });
  }
  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
}

export function authorizeRoles(...allowed) {
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Không đủ quyền truy cập.' });
    }
    next();
  };
}
