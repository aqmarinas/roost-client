import useAuth from "@/hooks/useAuth";

export default function CanAccess({ roles = [], children }) {
  const { auth } = useAuth();

  const userRole = auth?.role;
  const allowed = Array.isArray(roles) ? roles.includes(userRole) : roles === userRole;

  return allowed ? children : null;
}
