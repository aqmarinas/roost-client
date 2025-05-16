import { API_URL } from "@/config/config";
import axios from "axios";

export default axios.create({
  baseURL: `${API_URL}`,
});

export const axiosPrivate = axios.create({
  baseURL: `${API_URL}`,
  // headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
