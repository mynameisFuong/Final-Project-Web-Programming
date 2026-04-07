-- Bổ sung sample dữ liệu sau khi chạy schema.sql

INSERT INTO users (username, password_hash, full_name, email, role, status)
VALUES
  ('admin', '$2b$10$2w030oiXclNijRnEDjH74eMh.DBRKJQ20hsf2nawmq1KKMg8J5Fmu', 'Quản trị hệ thống', 'admin@example.com', 'ADMIN', 'ACTIVE'),
  ('tech', '$2b$10$yVjBRPRJ7oRo8aPG7l3zkepwYOLjGOaykNNur.pAYIbuHaR0gkbte', 'Kỹ thuật viên', 'tech@example.com', 'TECHNICIAN', 'ACTIVE'),
  ('user', '$2b$10$f6h4pty/4dkGSOEkukPo1OvPWvgim5qzCgPUvuUDWcbwVDfAolhRC', 'Người dùng', 'user@example.com', 'USER', 'ACTIVE');

INSERT INTO rooms (code, name, type, capacity, location, status)
VALUES
  ('P101', 'Phòng Lý thuyết 1', 'Lý thuyết', 40, 'Tầng 2', 'Hoạt động'),
  ('P202', 'Phòng Máy tính', 'Thực hành', 30, 'Tầng 3', 'Hoạt động');

INSERT INTO devices (room_id, code, name, type, status, imported_date, description)
VALUES
  (1, 'TB-001', 'Máy chiếu', 'Điện tử', 'Tốt', '2024-02-10', 'Máy chiếu chính'),
  (1, 'TB-002', 'Dàn loa', 'Điện tử', 'Hỏng', '2023-08-14', 'Loa phòng học'),
  (2, 'TB-101', 'Máy tính A', 'CNTT', 'Tốt', '2025-01-05', 'Máy trạm sinh viên'),
  (2, 'TB-102', 'Máy tính B', 'CNTT', 'Đang sửa chữa', '2024-09-22', 'Máy trạm bị lỗi mạng');
