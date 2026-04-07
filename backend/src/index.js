import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import roomsRoutes from './routes/rooms.js';
import devicesRoutes from './routes/devices.js';
import repairsRoutes from './routes/repairs.js';
import reportsRoutes from './routes/reports.js';
import accountsRoutes from './routes/accounts.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', authenticateToken, roomsRoutes);
app.use('/api/devices', authenticateToken, devicesRoutes);
app.use('/api/repairs', authenticateToken, repairsRoutes);
app.use('/api/reports', authenticateToken, reportsRoutes);
app.use('/api/accounts', authenticateToken, accountsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint không tồn tại.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Lỗi máy chủ.' });
});

app.listen(port, () => {
  console.log(`Backend API server running on http://localhost:${port}`);
});
