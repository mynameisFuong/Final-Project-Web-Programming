import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import StatCard from '../components/StatCard.jsx';
import { useData } from '../context/DataContext.jsx';

export default function DashboardPage() {
  const { summary } = useData();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Header />
        <section className="page-heading">
          <p className="eyebrow">Tổng quan hệ thống</p>
          <h2>Bảng điều khiển thiết bị phòng học</h2>
          <p className="page-intro">
            Xem nhanh trạng thái phòng học, thiết bị và lịch sử sửa chữa với giao diện thân thiện.
          </p>
        </section>
        <div className="grid-4 gap-xl">
          <StatCard title="Phòng học" value={summary.totalRooms} color="blue" />
          <StatCard title="Tổng thiết bị" value={summary.totalDevices} color="purple" />
          <StatCard title="Thiết bị tốt" value={summary.good} color="green" />
          <StatCard title="Thiết bị hỏng" value={summary.broken} color="red" />
        </div>
        <div className="grid-3 gap-lg stats-panel">
          <StatCard title="Đang sửa chữa" value={summary.repairing} color="orange" subtitle="Theo dõi nhanh" />
          <StatCard title="Lịch sử sửa chữa" value={summary.totalRepairs} color="blue" subtitle="Mục đã lưu" />
          <StatCard title="Tài khoản" value={summary.totalAccounts} color="purple" subtitle="Quản lý quyền" />
        </div>
        <section className="hero-card glass-card report-card">
          <div>
            <h3>Giao diện thiết kế chuyên nghiệp</h3>
            <p>
              Hỗ trợ các chức năng: quản lý phòng, thiết bị, cập nhật trạng thái, ghi nhận sửa chữa và báo hỏng.
            </p>
          </div>
          <div className="hero-actions">
            <span className="pill">Realtime</span>
            <span className="pill">Báo cáo 1 click</span>
            <span className="pill">Phân quyền linh hoạt</span>
          </div>
        </section>
      </main>
    </div>
  );
}
