import axios from "axios";

const instance = axios.create({
  baseURL: "/api", // proxy ไป backend
  withCredentials: true, // ✅ เพิ่มตรงนี้
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ ใส่ token
  }
  return config;
});

export default instance;
