import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Hệ thống Quản lý Thiết bị</p>
        <h1>Xin chào, {user?.fullName || 'Người dùng'}</h1>
      </div>
      <div className="header-actions">
        <span className="role-chip">{user?.role}</span>
        <button className="ghost-button" onClick={logout} type="button">
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
