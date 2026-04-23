import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    // 🔥 YA NO EXISTE LOGIN → mandar a auth-success
    return <Navigate to="/auth-success" replace />;
  }

  return children;
}

export default ProtectedRoute;