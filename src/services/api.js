import axios from "axios";

// 🌍 API BASE
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// ===============================
// 🔐 REQUEST INTERCEPTOR
// ===============================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===============================
// 🚨 RESPONSE INTERCEPTOR
// ===============================
API.interceptors.response.use(
  (response) => response,
  (error) => {

    if (!error.response) {
      console.error("🌐 Error de red:", error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {

      console.warn("🔒 401 recibido (NO borramos token)");

      // ❌ NO borrar token automáticamente
      // localStorage.removeItem("token");

      // ❌ NO redirigir automáticamente
      // window.location.href = "/auth-success";

      // solo log
    }

    return Promise.reject(error);
  }
);

// ===============================
// 📊 APIs
// ===============================

// 📜 Eventos por mundo
export const getEventsByWorld = async (worldId) => {
  const res = await API.get(`/events/${worldId}`);
  return res.data;
};

// 📊 Resumen del mundo
export const getSummary = async (worldId) => {
  const res = await API.get(`/events/summary/${worldId}`);
  return res.data;
};

// 🌍 Mundos del usuario
export const getWorlds = async () => {
  const res = await API.get("/worlds");
  return res.data;
};

export default API;