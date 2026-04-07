import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';

const emptyForm = { roomId: '', deviceId: '', technician: '', note: '' };

export default function RepairsPage() {
  const { user } = useAuth();
  const { rooms, devices, repairs, addRepair } = useData();
  const isAdmin = user?.role === 'ADMIN';
  const isTechnician = user?.role === 'TECHNICIAN';
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  const availableDevices = useMemo(() => devices.filter((device) => device.status !== 'Tốt'), [devices]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectedRoomDevices = useMemo(
    () => devices.filter((device) => device.roomId === Number(form.roomId)),
    [devices, form.roomId]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.roomId || !form.deviceId || !form.technician || !form.note) {
      setMessage('Vui lòng nhập đầy đủ thông tin sửa chữa.');
      return;
    }
    const device = devices.find((item) => item.id === Number(form.deviceId));
    const room = rooms.find((item) => item.id === Number(form.roomId));
    addRepair({
      roomName: room?.name || '',
      deviceId: device?.id,
      deviceCode: device?.code,
      deviceName: device?.name,
      technician: form.technician,
      note: form.note,
      status: device?.status || 'Đang sửa chữa'
    });
    setMessage('Ghi nhận sửa chữa thành công.');
    setForm(emptyForm);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Header />
        <section className="page-heading">
          <p className="eyebrow">Lịch sử sửa chữa</p>
          <h2>Ghi nhận và theo dõi sửa chữa</h2>
        </section>
        <div className={`split-grid gap-xl ${!isAdmin && !isTechnician ? 'full-width' : ''}`}>
          <section className="glass-card panel-box">
            <h3>Lịch sử sửa chữa</h3>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Thiết bị</th>
                    <th>Phòng</th>
                    <th>Kỹ thuật viên</th>
                    <th>Ngày</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {repairs.map((item) => (
                    <tr key={item.id}>
                      <td>{item.deviceCode} - {item.deviceName}</td>
                      <td>{item.roomName}</td>
                      <td>{item.technician}</td>
                      <td>{item.createdAt}</td>
                      <td>{item.note}</td>
                    </tr>
                  ))}
                  {!repairs.length && (
                    <tr>
                      <td colSpan="5" className="empty-row">Chưa có bản ghi sửa chữa.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          {(isAdmin || isTechnician) && (
            <section className="glass-card panel-box form-box">
              <h3>Ghi nhận sửa chữa</h3>
            <form onSubmit={handleSubmit} className="entity-form">
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
                  {selectedRoomDevices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.code} - {device.name} ({device.status})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Kỹ thuật viên
                <input
                  value={form.technician}
                  onChange={(e) => handleChange('technician', e.target.value)}
                  placeholder={user?.fullName || 'Tên kỹ thuật viên'}
                />
              </label>
              <label>
                Nội dung sửa chữa
                <textarea value={form.note} onChange={(e) => handleChange('note', e.target.value)} placeholder="Mô tả chi tiết" />
              </label>
              {message && <div className="form-message info">{message}</div>}
              <button type="submit" className="primary-button">
                Ghi nhận
              </button>
            </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
