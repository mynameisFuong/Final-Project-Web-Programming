import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';

const emptyDevice = { code: '', name: '', type: '', status: 'Tốt', imported: '', description: '' };

export default function DevicesPage() {
  const { user } = useAuth();
  const { rooms, devices, addDevice, updateDevice, deleteDevice } = useData();
  const isAdmin = user?.role === 'ADMIN';
  const [roomId, setRoomId] = useState(rooms[0]?.id || null);
  const [form, setForm] = useState(emptyDevice);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!roomId && rooms.length) {
      setRoomId(rooms[0].id);
    }
  }, [rooms, roomId]);

  const roomDevices = useMemo(() => devices.filter((item) => item.roomId === roomId), [devices, roomId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!roomId || !form.code || !form.name || !form.type || !form.imported) {
      setMessage('Vui lòng nhập đầy đủ thông tin thiết bị.');
      return;
    }
    const duplicate = devices.some((device) => device.code === form.code && device.id !== form.id);
    if (duplicate) {
      setMessage('Mã thiết bị đã tồn tại.');
      return;
    }
    const payload = { ...form, roomId, imported: form.imported };
    if (editing) {
      updateDevice({ ...payload, id: editing });
      setMessage('Cập nhật thiết bị thành công.');
    } else {
      addDevice(payload);
      setMessage('Thêm thiết bị mới thành công.');
    }
    setForm(emptyDevice);
    setEditing(null);
  };

  const handleEdit = (device) => {
    setEditing(device.id);
    setForm(device);
    setRoomId(device.roomId);
    setMessage('');
  };

  const handleDelete = (device) => {
    deleteDevice(device.id);
    setMessage('Xóa thiết bị thành công.');
    if (editing === device.id) {
      setEditing(null);
      setForm(emptyDevice);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Header />
        <section className="page-heading">
          <p className="eyebrow">Quản lý thiết bị</p>
          <h2>Danh sách thiết bị theo phòng</h2>
        </section>
        <div className={`split-grid gap-xl ${!isAdmin ? 'full-width' : ''}`}>
          <section className="glass-card panel-box">
            <div className="page-actions">
              <label>
                Chọn phòng
                <select value={roomId || ''} onChange={(e) => setRoomId(Number(e.target.value))}>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.code} - {room.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Loại</th>
                    <th>Trạng thái</th>
                    <th>Ngày nhập</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {roomDevices.map((device) => (
                    <tr key={device.id}>
                      <td>{device.code}</td>
                      <td>{device.name}</td>
                      <td>{device.type}</td>
                      <td>{device.status}</td>
                      <td>{device.imported}</td>
                      <td className="table-actions">
                        {isAdmin && (
                          <>
                            <button type="button" onClick={() => handleEdit(device)} className="ghost-button small">
                              Sửa
                            </button>
                            <button type="button" onClick={() => handleDelete(device)} className="danger-button small">
                              Xóa
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!roomDevices.length && (
                    <tr>
                      <td colSpan="6" className="empty-row">
                        Không có thiết bị trong phòng này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          {isAdmin && (
            <section className="glass-card panel-box form-box">
              <h3>{editing ? 'Cập nhật thiết bị' : 'Thêm thiết bị mới'}</h3>
            <form onSubmit={handleSubmit} className="entity-form">
              <label>
                Mã thiết bị
                <input value={form.code} onChange={(e) => handleChange('code', e.target.value)} placeholder="VD: TB-001" />
              </label>
              <label>
                Tên thiết bị
                <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="VD: Máy chiếu" />
              </label>
              <label>
                Loại thiết bị
                <input value={form.type} onChange={(e) => handleChange('type', e.target.value)} placeholder="VD: Điện tử" />
              </label>
              <label>
                Trạng thái
                <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                  <option>Tốt</option>
                  <option>Hỏng</option>
                  <option>Đang sửa chữa</option>
                </select>
              </label>
              <label>
                Ngày nhập
                <input value={form.imported} onChange={(e) => handleChange('imported', e.target.value)} type="date" />
              </label>
              <label>
                Mô tả
                <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Mô tả ngắn" />
              </label>
              {message && <div className="form-message info">{message}</div>}
              <button type="submit" className="primary-button">
                {editing ? 'Lưu thiết bị' : 'Thêm thiết bị'}
              </button>
            </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
