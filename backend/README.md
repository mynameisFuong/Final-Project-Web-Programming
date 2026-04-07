# Backend Quản lý Thiết bị Phòng học

API server Node.js / Express kết nối PostgreSQL.

## Khởi tạo

1. Sao chép file cấu hình môi trường:
   ```bash
   cd backend
   copy .env.example .env
   ```
2. Điền thông tin kết nối PostgreSQL vào `.env`.

## Cài đặt

```bash
cd backend
npm install
```

## Khởi động

```bash
npm run dev
```

## Tạo schema

Khi database đã sẵn sàng, chạy file SQL:

```bash
psql -U <username> -d <database> -f backend/db/schema.sql
```

## API chính

- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/rooms`
- `POST /api/rooms`
- `PUT /api/rooms/:id`
- `DELETE /api/rooms/:id`
- `GET /api/devices`
- `POST /api/devices`
- `PUT /api/devices/:id`
- `DELETE /api/devices/:id`
- `PATCH /api/devices/:id/status`
- `GET /api/repairs`
- `POST /api/repairs`
- `GET /api/reports`
- `POST /api/reports`
- `GET /api/accounts`
- `POST /api/accounts`
- `PUT /api/accounts/:id`
- `PATCH /api/accounts/:id/lock`

Ghi chú: frontend tích hợp dùng `VITE_API_BASE_URL` để gọi API.
