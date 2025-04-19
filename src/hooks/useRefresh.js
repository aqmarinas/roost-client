import useAuth from "./useAuth";

export default function useRefresh() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/auth/refresh`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to refresh");
    }

    setAuth((prev) => ({ ...prev, accessToken: result?.data?.accessToken }));
    return result.data.accessToken;
  };

  return refresh;
}
