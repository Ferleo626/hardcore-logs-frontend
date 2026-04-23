import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  const valid =
    token &&
    token !== "undefined" &&
    token !== "null";

  if (!valid) {
    // 🔥 IMPORTANTE: ir a home, NO auth-success
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;