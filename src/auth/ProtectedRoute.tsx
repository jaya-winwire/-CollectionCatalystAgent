import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}
