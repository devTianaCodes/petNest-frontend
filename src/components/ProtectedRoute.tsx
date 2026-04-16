import { Navigate, Outlet, useLocation } from "react-router-dom";
import { QueryStateNotice } from "./QueryStateNotice";
import { useAuth } from "../features/auth/AuthContext";
import { getProtectedRedirect } from "../features/auth/authRedirect";

type ProtectedRouteProps = {
  role?: "ADMIN";
};

export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <QueryStateNotice title="Checking your session" message="Confirming your account access." />;
  }

  if (!user) {
    return <Navigate to={getProtectedRedirect(location.pathname, location.search)} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
