import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3500/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response) {
      const custom = {
        status: err.response.status,
        message: err.response.data?.message || err.message,
        data: err.response.data,
      };
      return Promise.reject(custom);
    }
    return Promise.reject(err);
  }
);

export default client;
