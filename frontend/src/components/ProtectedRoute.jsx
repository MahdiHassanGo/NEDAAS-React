// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { firebaseUser, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-deepTeal">
        Loading...
      </div>
    );
  }

  // Not logged in → go to login
  if (!firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check them
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // Unauthorized → send to member dashboard (or a 403 page later)
      return <Navigate to="/dashboard/member" replace />;
    }
  }

  return children;
}
