import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const isValid =
      token &&
      token !== "undefined" &&
      token !== "null";

    setValid(isValid);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Cargando sesión...
      </div>
    );
  }

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