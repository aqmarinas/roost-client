import { useEffect, useState, useCallback } from "react";

const useFetch = (endpoint) => {
  const url = `${import.meta.env.VITE_LOCAL_API}${endpoint}`;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }
      const result = await response.json();

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useFetch;
