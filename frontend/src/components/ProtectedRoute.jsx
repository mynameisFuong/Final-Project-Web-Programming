import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="page-heading"><h2>Đang kiểm tra phiên...</h2></div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
