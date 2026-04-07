import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Header />
        <section className="page-heading">
          <p className="eyebrow">404</p>
          <h2>Trang không tìm thấy</h2>
          <p>Đường dẫn bạn truy cập không tồn tại. Vui lòng trở về dashboard hoặc kiểm tra lại URL.</p>
          <button type="button" className="primary-button" onClick={() => navigate('/dashboard')}>
            Về dashboard
          </button>
        </section>
      </main>
    </div>
  );
}
