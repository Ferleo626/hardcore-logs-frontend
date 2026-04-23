function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  const valid =
    token &&
    token !== "undefined" &&
    token !== "null";

  // 🔥 IMPORTANTE: no redirigir en loop
  if (!valid) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        🔒 No hay sesión activa. Inicia sesión desde el mod de Minecraft.
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;