import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    console.log("🔐 TOKEN:", token);

    if (!token || token === "null" || token === "undefined") {
      console.error("❌ Token inválido");
      window.location.replace("/");
      return;
    }

    localStorage.setItem("token", token);

    console.log("✅ Token guardado");

    window.location.replace("/");

  }, []);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
      Conectando con Minecraft...
    </div>
  );
}