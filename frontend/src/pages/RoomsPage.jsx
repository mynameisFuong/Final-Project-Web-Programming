import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';

const emptyRoom = { code: '', name: '', type: '', capacity: '', location: '', status: 'Hoạt động' };

export default function RoomsPage() {
  const { user } = useAuth();
  const { rooms, devices, addRoom, updateRoom, deleteRoom } = useData();
  const isAdmin = user?.role === 'ADMIN';
  const [form, setForm] = useState(emptyRoom);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  const roomUsage = useMemo(
    () => rooms.map((room) => ({ ...room, deviceCount: devices.filter((device) => device.roomId === room.id).length })),
    [rooms, devices]
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.code || !form.name || !form.type || !form.capacity || !form.location) {
      setMessage('Vui lòng điền đầy đủ thông tin phòng học.');
      return;
    }
    const duplicate = rooms.some((room) => room.code === form.code && room.id !== form.id);
    if (duplicate) {
      setMessage('Mã phòng đã tồn tại.');
      return;
    }
    if (editing) {
      updateRoom({ ...form, id: editing });
      setMessage('Cập nhật phòng học thành công.');
    } else {
      addRoom(form);
      setMessage('Thêm phòng học mới thành công.');
    }
    setForm(emptyRoom);
    setEditing(null);
  };

  const handleEdit = (room) => {
    setEditing(room.id);
    setForm(room);
    setMessage('');
  };

  const handleDelete = (room) => {
    const hasDevices = devices.some((device) => device.roomId === room.id);
    if (hasDevices) {
      setMessage('Không thể xóa phòng còn thiết bị. Vui lòng xóa thiết bị trước.');
      return;
    }
    deleteRoom(room.id);
    setMessage('Xóa phòng học thành công.');
    if (editing === room.id) {
      setEditing(null);
      setForm(emptyRoom);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Header />
        <section className="page-heading">
          <p className="eyebrow">Quản lý phòng học</p>
          <h2>Danh sách và cấu hình phòng học</h2>
        </section>
        <div className={`split-grid gap-xl ${!isAdmin ? 'full-width' : ''}`}>
          <section className="glass-card panel-box">
            <h3>Danh sách phòng học</h3>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Tên phòng</th>
                    <th>Loại</th>
                    <th>Sức chứa</th>
                    <th>Thiết bị</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {roomUsage.map((room) => (
                    <tr key={room.id}>
                      <td>{room.code}</td>
                      <td>{room.name}</td>
                      <td>{room.type}</td>
                      <td>{room.capacity}</td>
                      <td>{room.deviceCount}</td>
                      <td>{room.status}</td>
                      <td className="table-actions">
                        {isAdmin && (
                          <>
                            <button type="button" onClick={() => handleEdit(room)} className="ghost-button small">
                              Sửa
                            </button>
                            <button type="button" onClick={() => handleDelete(room)} className="danger-button small">
                              Xóa
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          {isAdmin && (
            <section className="glass-card panel-box form-box">
              <h3>{editing ? 'Cập nhật phòng' : 'Thêm phòng mới'}</h3>
            <form onSubmit={handleSubmit} className="entity-form">
              <label>
                Mã phòng
                <input value={form.code} onChange={(e) => handleChange('code', e.target.value)} placeholder="VD: P101" />
              </label>
              <label>
                Tên phòng
                <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="VD: Phòng A1" />
              </label>
              <label>
                Loại phòng
                <input value={form.type} onChange={(e) => handleChange('type', e.target.value)} placeholder="VD: Lý thuyết" />
              </label>
              <label>
                Sức chứa
                <input value={form.capacity} onChange={(e) => handleChange('capacity', e.target.value)} placeholder="VD: 40" />
              </label>
              <label>
                Vị trí
                <input value={form.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="VD: Tầng 2" />
              </label>
              <label>
                Trạng thái
                <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                  <option>Hoạt động</option>
                  <option>Ngừng hoạt động</option>
                </select>
              </label>
              {message && <div className="form-message info">{message}</div>}
              <button type="submit" className="primary-button">
                {editing ? 'Lưu thay đổi' : 'Thêm phòng'}
              </button>
            </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
