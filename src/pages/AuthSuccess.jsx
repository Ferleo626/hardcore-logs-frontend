import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    console.log("🔐 TOKEN RECIBIDO:", token);

    // ❌ token inválido → volver al home
    if (!token || token.includes("error")) {
      console.error("❌ Token inválido");
      window.location.replace("/");
      return;
    }

    // 🔥 guardar token inmediatamente
    localStorage.setItem("token", token);

    console.log("✅ Token guardado correctamente");

    // 🔥 pequeño delay para evitar race condition en React Router
    setTimeout(() => {
      window.location.replace("/");
    }, 80);

  }, []);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
      Conectando con Minecraft...
    </div>
  );
}