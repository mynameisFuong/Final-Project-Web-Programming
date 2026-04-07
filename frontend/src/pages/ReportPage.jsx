import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useData } from '../context/DataContext.jsx';

export default function ReportPage() {
  const { rooms, devices, addReport } = useData();
  const [form, setForm] = useState({ roomId: '', deviceId: '', description: '' });
  const [message, setMessage] = useState('');

  const selectedDevices = useMemo(
    () => devices.filter((device) => device.roomId === Number(form.roomId)),
    [devices, form.roomId]
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.roomId || !form.deviceId || !form.description) {
      setMessage('Vui lòng chọn phòng, thiết bị và nhập mô tả sự cố.');
      return;
    }
    const device = devices.find((item) => item.id === Number(form.deviceId));
    const room = rooms.find((item) => item.id === Number(form.roomId));
    addReport({
      roomName: room?.name || '',
      deviceId: device?.id,
      deviceCode: device?.code,
      deviceName: device?.name,
      technician: 'Chờ xử lý',
      note: form.description,
      status: 'Hỏng'
    });
    setMessage('Báo hỏng thiết bị thành công. Bộ phận kỹ thuật sẽ tiếp nhận.');
    setForm({ roomId: '', deviceId: '', description: '' });
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Header />
        <section className="page-heading">
          <p className="eyebrow">Báo hỏng thiết bị</p>
          <h2>Gửi yêu cầu sửa chữa nhanh</h2>
        </section>
        <div className="glass-card panel-box report-card">
          <div className="report-copy">
            <h3>Thông báo nhanh thiết bị cần sửa</h3>
            <p>
              Chọn phòng và thiết bị gặp sự cố, mô tả chi tiết và gửi ngay. Hệ thống sẽ lưu lại lịch sử và phân quyền xử lý.
            </p>
          </div>
          <form className="entity-form report-form" onSubmit={handleSubmit}>
            <label>
              Chọn phòng
              <select value={form.roomId} onChange={(e) => handleChange('roomId', e.target.value)}>
                <option value="">Chọn phòng</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.code} - {room.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Chọn thiết bị
              <select value={form.deviceId} onChange={(e) => handleChange('deviceId', e.target.value)}>
                <option value="">Chọn thiết bị</option>
                {selectedDevices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.code} - {device.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Mô tả sự cố
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Thiết bị không hoạt động / lỗi tín hiệu / hỏng màn hình..."
              />
            </label>
            {message && <div className="form-message info">{message}</div>}
            <button type="submit" className="primary-button">
              Gửi báo hỏng
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
