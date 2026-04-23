import { useEffect } from "react";

export default function AuthSuccess() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      console.log("✅ Token guardado");

      // 🔥 CLAVE: recargar toda la app
      window.location.href = "/";
    } else {
      console.error("❌ No token");
      window.location.href = "/login";
    }

  }, []);

  return <h1>Conectando...</h1>;
}