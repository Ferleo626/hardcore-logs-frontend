import axios from "axios";

// 🌍 URL dinámica (local + producción)
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

    // ⚠️ Si no hay response (error de red)
    if (!error.response) {
      console.error("🌐 Error de red:", error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {

      // 🚫 NO romper auto-login invisible
      if (window.location.pathname === "/auth-success") {
        return Promise.reject(error);
      }

      console.warn("🔒 Sesión expirada o token inválido");

      // limpiar token
      localStorage.removeItem("token");

      // evitar loop infinito
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
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

// 🌍 Obtener mundos del usuario
export const getWorlds = async () => {
  const res = await API.get("/worlds");
  return res.data;
};

export default API;