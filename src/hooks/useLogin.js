import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/config/config";

export function useLogin() {
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to login");

      return result.data;
    },
  });
  return mutation;
}
