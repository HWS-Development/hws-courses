import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (location.pathname.includes('/watch')) {
    console.log(location.pathname);
    localStorage.setItem('prevLocation',location.pathname)
  }
  if (!session) {
    const from = location.pathname + location.search + location.hash;
    // نمرّر الوجهة في query + في state (ونكتبها لاحقًا في localStorage داخل Auth)
    return (
      <Navigate
        to={`/auth?next=${encodeURIComponent(from || location.pathname)}`}
        replace
        state={{ from: from || location.pathname }}
      />
    );
  }

  return children;
}
