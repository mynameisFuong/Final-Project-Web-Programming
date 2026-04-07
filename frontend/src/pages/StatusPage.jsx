import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useData } from '../context/DataContext.jsx';

export default function StatusPage() {
  const { rooms, devices, updateDeviceStatus } = useData();
  const [roomId, setRoomId] = useState(rooms[0]?.id || null);
  const [message, setMessage] = useState('');

  const roomDevices = useMemo(() => devices.filter((item) => item.roomId === roomId), [devices, roomId]);

  const handleStatusChange = (deviceId, status) => {
    updateDeviceStatus(deviceId, status);
    setMessage('Cập nhật trạng thái thiết bị thành công.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Header />
        <section className="page-heading">
          <p className="eyebrow">Cập nhật trạng thái</p>
          <h2>Thay đổi trạng thái thiết bị nhanh</h2>
        </section>
        <div className="glass-card panel-box">
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
          {message && <div className="form-message info">{message}</div>}
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {roomDevices.map((device) => (
                  <tr key={device.id}>
                    <td>{device.code}</td>
                    <td>{device.name}</td>
                    <td>{device.status}</td>
                    <td className="status-actions">
                      {['Tốt', 'Hỏng', 'Đang sửa chữa'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleStatusChange(device.id, status)}
                          className={device.status === status ? 'primary-button small' : 'ghost-button small'}
                        >
                          {status}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
                {!roomDevices.length && (
                  <tr>
                    <td colSpan="4" className="empty-row">
                      Chọn phòng có thiết bị để cập nhật.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
