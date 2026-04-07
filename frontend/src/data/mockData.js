export const initialRooms = [
  { id: 1, code: 'P101', name: 'Phòng Lý thuyết 1', type: 'Lý thuyết', capacity: '40', location: 'Tầng 2', status: 'Hoạt động' },
  { id: 2, code: 'P202', name: 'Phòng Máy tính', type: 'Thực hành', capacity: '30', location: 'Tầng 3', status: 'Hoạt động' },
  { id: 3, code: 'P305', name: 'Phòng Thí nghiệm', type: 'Thực hành', capacity: '20', location: 'Tầng 4', status: 'Ngừng hoạt động' }
];

export const initialDevices = [
  { id: 11, roomId: 1, code: 'TB-001', name: 'Máy chiếu', type: 'Điện tử', status: 'Tốt', imported: '2024-02-10', description: 'Máy chiếu chính' },
  { id: 12, roomId: 1, code: 'TB-002', name: 'Dàn loa', type: 'Điện tử', status: 'Hỏng', imported: '2023-08-14', description: 'Loa phòng học' },
  { id: 13, roomId: 2, code: 'TB-101', name: 'Máy tính A', type: 'CNTT', status: 'Tốt', imported: '2025-01-05', description: 'Máy trạm sinh viên' },
  { id: 14, roomId: 2, code: 'TB-102', name: 'Máy tính B', type: 'CNTT', status: 'Đang sửa chữa', imported: '2024-09-22', description: 'Máy trạm bị lỗi mạng' }
];

export const initialRepairs = [
  { id: 100, roomName: 'Phòng Lý thuyết 1', deviceId: 12, deviceCode: 'TB-002', deviceName: 'Dàn loa', technician: 'Kỹ thuật viên', note: 'Kiểm tra nguồn và dây kết nối.', status: 'Hỏng', createdAt: '2026-03-30' },
  { id: 101, roomName: 'Phòng Máy tính', deviceId: 14, deviceCode: 'TB-102', deviceName: 'Máy tính B', technician: 'Kỹ thuật viên', note: 'Thay RAM và cài lại driver.', status: 'Đang sửa chữa', createdAt: '2026-03-28' }
];

export const initialUsers = [
  { id: 1, username: 'admin', password: 'Admin@123', fullName: 'Quản trị hệ thống', email: 'admin@domain.com', role: 'ADMIN', status: 'ACTIVE' },
  { id: 2, username: 'tech', password: 'Tech@123', fullName: 'Kỹ thuật viên', email: 'tech@domain.com', role: 'TECHNICIAN', status: 'ACTIVE' },
  { id: 3, username: 'user', password: 'User@123', fullName: 'Người dùng', email: 'user@domain.com', role: 'USER', status: 'ACTIVE' }
];
