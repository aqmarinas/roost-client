import axios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const mutation = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axios.post("/auth/login", data, {
          withCredentials: true,
        });
        return res.data.data;
      } catch (error) {
        const message = error.response?.data?.message || "Login failed";
        throw new Error(message);
      }
    },
  });
  return mutation;
}
