import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

type ProtectedRouteProps = {
  role?: "ADMIN";
};

export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="rounded-3xl bg-white/80 p-10 text-center shadow-sm">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
