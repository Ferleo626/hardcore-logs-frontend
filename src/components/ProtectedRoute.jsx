import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // 🔥 validación estricta real
  const isValid =
    token &&
    token !== "undefined" &&
    token !== "null" &&
    token.trim() !== "";

  if (!isValid) {
    return <Navigate to="/auth-success" replace />;
  }

  return children;
}

export default ProtectedRoute;