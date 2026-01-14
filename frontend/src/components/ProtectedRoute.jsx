import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirige vers /login si non authentifié
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

