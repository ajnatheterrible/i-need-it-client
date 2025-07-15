import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useLocation } from "react-router-dom";

export default function AuthInitializer({ children }) {
  const loadUserFromRefresh = useAuthStore((s) => s.loadUserFromRefresh);
  const hasRefreshed = useAuthStore((s) => s.hasRefreshed);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  useEffect(() => {
    loadUserFromRefresh();

    const interval = setInterval(() => {
      loadUserFromRefresh();
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadUserFromRefresh]);

  if (!hasRefreshed) return null;

  const isOnCompleteSignup = location.pathname === "/complete-signup";

  if (user && !user.username && !isOnCompleteSignup) {
    return <Navigate to="/complete-signup" replace />;
  }

  return children;
}
