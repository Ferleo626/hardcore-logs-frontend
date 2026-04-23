import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    console.log("🔐 TOKEN RECIBIDO:", token);

    // ❌ SI NO HAY TOKEN → romper loop directo
    if (!token || token === "null" || token === "undefined") {
      console.error("❌ No hay token, cortando loop");
      window.location.replace("/"); // o página de error si querés
      return;
    }

    localStorage.setItem("token", token);

    console.log("✅ Token guardado");

    window.location.replace("/");

  }, []);

  return <h1>Conectando...</h1>;
}