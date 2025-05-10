import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useLogin() {
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("/auth/login", data, {
        withCredentials: true,
      });
      return res.data.data;
    },
  });
  return mutation;
}
