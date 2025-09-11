import axios from "axios";

const backendUrl: string =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("Backend URL:", backendUrl);
