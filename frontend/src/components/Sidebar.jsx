import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navigation = {
  ADMIN: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Phòng học', path: '/rooms' },
    { label: 'Thiết bị', path: '/devices' },
    { label: 'Cập nhật trạng thái', path: '/status' },
    { label: 'Sửa chữa', path: '/repairs' },
    { label: 'Báo hỏng', path: '/report' },
    { label: 'Tài khoản', path: '/accounts' }
  ],
  TECHNICIAN: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Cập nhật trạng thái', path: '/status' },
    { label: 'Sửa chữa', path: '/repairs' },
    { label: 'Báo hỏng', path: '/report' }
  ],
  USER: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Phòng học', path: '/rooms' },
    { label: 'Thiết bị', path: '/devices' },
    { label: 'Lịch sử sửa chữa', path: '/repairs' },
    { label: 'Báo hỏng', path: '/report' }
  ]
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = navigation[user?.role] || [];

  return (
    <aside className="sidebar">
      <div className="brand-panel">
        <span>Q-LY</span>
        <p>Thiết bị phòng học</p>
      </div>
      <nav className="nav-menu">
        {links.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
