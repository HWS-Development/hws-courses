// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!session) {
    const from = (location.pathname + location.search + location.hash) || location.pathname;

    return (
      <Navigate
        replace
        to={{
          pathname: '/auth',
          search: `?next=${encodeURIComponent(from)}`, // ✅ force query to exist
        }}
        state={{ from }} // ✅ extra fallback for Auth.jsx
      />
    );
  }

  return children;
}
