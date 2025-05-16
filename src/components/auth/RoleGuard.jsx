import useAuth from "@/hooks/useAuth";

export default function RoleGuard({ roles = [], children }) {
  const { auth, isAuthReady } = useAuth();
  if (!isAuthReady) return null;

  const userRole = auth?.role;
  if (!userRole) return null;

  const allowed = Array.isArray(roles) ? roles.includes(userRole) : roles === userRole;

  return allowed ? children : null;
}
