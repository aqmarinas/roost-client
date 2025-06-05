import { useMutation } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function useLogout() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      await axios.get("/auth/logout", {
        withCredentials: true,
      });
    },
    onSettled: () => {
      setAuth({});
      navigate("/login", { replace: true });
      toast.success("Logout successful");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  return mutation;
}
