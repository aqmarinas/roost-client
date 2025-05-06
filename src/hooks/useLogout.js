import { useMutation } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_LOCAL_API}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");
    },
    onSettled: () => {
      setAuth({});
      navigate("/login", { replace: true });
    },
    onError: (err) => {
      console.error("Logout error:", err.message);
    },
  });

  return mutation;
}
