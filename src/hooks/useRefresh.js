import useAuth from "./useAuth";
import axios from "@/lib/axios";

export default function useRefresh() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });

      const accessToken = response?.data?.data?.accessToken;

      setAuth((prev) => ({
        ...prev,
        accessToken,
      }));

      return accessToken;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to refresh");
    }
  };

  return refresh;
}
