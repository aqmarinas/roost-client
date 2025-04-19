import useAuth from "./useAuth";

export default function useLogout() {
  const { setAuth } = useAuth();

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_LOCAL_API}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setAuth({});
    }
  };

  return logout;
}
