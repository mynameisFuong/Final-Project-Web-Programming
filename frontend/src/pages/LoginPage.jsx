import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setInfo('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setInfo(error || 'Đăng nhập thất bại.');
      clearError();
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel glass-card">
        <div className="login-brand">
          <h1>Hệ thống quản lý thiết bị</h1>
          <p>Đăng nhập để bắt đầu theo dõi phòng học, thiết bị và trạng thái sửa chữa.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Tên đăng nhập
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin / tech / user"
            />
          </label>
          <label>
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </label>
          {(info || error) && <div className="form-message">{info || error}</div>}
          <button type="submit" className="primary-button">
            Đăng nhập
          </button>
        </form>
        <div className="login-tips">
          <p>Thông tin mẫu:</p>
          <ul>
            <li>ADMIN / Admin@123</li>
            <li>TECHNICIAN / Tech@123</li>
            <li>USER / User@123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
