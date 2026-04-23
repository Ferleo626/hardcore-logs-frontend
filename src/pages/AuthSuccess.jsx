import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");

    console.log("🔍 Token desde URL:", urlToken);

    if (!urlToken) {
      console.log("❌ No hay token → redirigiendo");
      window.location.replace("/");
      return;
    }

    try {
      localStorage.setItem("token", urlToken);

      console.log("✅ Token guardado:", urlToken);

      setTimeout(() => {
        window.location.replace("/");
      }, 100);
    } catch (e) {
      console.log("❌ Error guardando token", e);
      window.location.replace("/");
    }
  }, []);

  return <h1>Conectando...</h1>;
}