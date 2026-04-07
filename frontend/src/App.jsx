import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import RoomsPage from './pages/RoomsPage.jsx';
import DevicesPage from './pages/DevicesPage.jsx';
import StatusPage from './pages/StatusPage.jsx';
import RepairsPage from './pages/RepairsPage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="rooms" element={<RoomsPage />} />
                    <Route path="devices" element={<DevicesPage />} />
                    <Route path="status" element={<StatusPage />} />
                    <Route path="repairs" element={<RepairsPage />} />
                    <Route path="report" element={<ReportPage />} />
                    <Route path="accounts" element={<AccountsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
