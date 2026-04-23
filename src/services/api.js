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

      console.warn("🔒 Token inválido o expirado");

      // limpiar token
      localStorage.removeItem("token");

      // 🔥 volver al login del mod (NO /login)
      if (window.location.pathname !== "/auth-success") {
        window.location.href = "/auth-success";
      }
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