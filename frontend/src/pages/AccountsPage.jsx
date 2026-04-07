import { useState } from 'react';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';

const emptyAccount = { username: '', password: '', fullName: '', email: '', role: 'USER' };

export default function AccountsPage() {
  const { user } = useAuth();
  const { accounts, addAccount, toggleAccountLock } = useData();
  const [form, setForm] = useState(emptyAccount);
  const [message, setMessage] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.username || !form.password || !form.fullName || !form.email) {
      setMessage('Vui lòng nhập đầy đủ thông tin tài khoản.');
      return;
    }
    if (accounts.some((item) => item.username === form.username)) {
      setMessage('Tên đăng nhập đã tồn tại.');
      return;
    }
    addAccount({ ...form, status: 'ACTIVE' });
    setForm(emptyAccount);
    setMessage('Thêm tài khoản mới thành công.');
  };

  if (user.role !== 'ADMIN') {
    return (
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Header />
          <section className="page-heading">
            <p className="eyebrow">Quản lý tài khoản</p>
            <h2>Bạn không có quyền truy cập</h2>
            <p>Chỉ ADMIN mới được phép quản lý tài khoản.</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Header />
        <section className="page-heading">
          <p className="eyebrow">Quản lý tài khoản</p>
          <h2>Thêm và quản lý người dùng</h2>
        </section>
        <div className="split-grid gap-xl">
          <section className="glass-card panel-box">
            <h3>Danh sách tài khoản</h3>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td>{account.username}</td>
                      <td>{account.fullName}</td>
                      <td>{account.email}</td>
                      <td>{account.role}</td>
                      <td>{account.status}</td>
                      <td className="table-actions">
                        <button type="button" className="ghost-button small" onClick={() => toggleAccountLock(account.id)}>
                          {account.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="glass-card panel-box form-box">
            <h3>Thêm tài khoản mới</h3>
            <form onSubmit={handleSubmit} className="entity-form">
              <label>
                Username
                <input value={form.username} onChange={(e) => handleChange('username', e.target.value)} placeholder="Tên đăng nhập" />
              </label>
              <label>
                Mật khẩu
                <input type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} placeholder="Mật khẩu" />
              </label>
              <label>
                Họ tên
                <input value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="Họ và tên" />
              </label>
              <label>
                Email
                <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Email" />
              </label>
              <label>
                Role
                <select value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
                  <option value="ADMIN">ADMIN</option>
                  <option value="TECHNICIAN">TECHNICIAN</option>
                  <option value="USER">USER</option>
                </select>
              </label>
              {message && <div className="form-message info">{message}</div>}
              <button type="submit" className="primary-button">
                Tạo tài khoản
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
