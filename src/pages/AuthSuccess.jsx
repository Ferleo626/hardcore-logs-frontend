import { useEffect, useRef } from "react";

export default function AuthSuccess() {
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("🔐 URL COMPLETA:", window.location.href);
    console.log("🔐 TOKEN RAW:", token);

    if (!token || token === "null" || token === "undefined") {
      console.error("❌ NO LLEGA TOKEN DESDE EL MOD");

      setTimeout(() => {
        window.location.replace("/");
      }, 300);

      return;
    }

    try {
      localStorage.setItem("token", token);
      console.log("✅ TOKEN GUARDADO:", token);
    } catch (e) {
      console.error("❌ ERROR GUARDANDO TOKEN", e);
    }

    // limpiar URL SIN romper flujo
    window.history.replaceState({}, document.title, "/");

    // redirección controlada
    setTimeout(() => {
      window.location.replace("/");
    }, 400);

  }, []);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
      Conectando con Minecraft...
    </div>
  );
}