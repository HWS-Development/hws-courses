import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  // Wait until AuthProvider finishes reading the session
  if (loading) {
    return (
      <div className="container-std py-10 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children;
}
