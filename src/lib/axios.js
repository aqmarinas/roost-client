import axios from "axios";

export default axios.create({
  baseURL: `${import.meta.env.VITE_LOCAL_API}`,
});

export const axiosPrivate = axios.create({
  baseURL: `${import.meta.env.VITE_LOCAL_API}`,
  // headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
