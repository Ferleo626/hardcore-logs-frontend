import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    // 🚫 NO redirigir a auth-success
    // 👉 solo bloquear acceso
    return <div style={{ padding: 20 }}>
      No hay sesión activa. Inicia sesión desde el mod.
    </div>;
  }

  return children;
}

export default ProtectedRoute;