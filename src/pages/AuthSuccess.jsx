import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("🔐 URL COMPLETA:", window.location.href);
    console.log("🔐 TOKEN RAW:", token);

    // ❌ si no hay token → no romper nada
    if (!token || token === "null" || token === "undefined") {
      console.error("❌ NO LLEGA TOKEN DESDE EL MOD");

      // NO loop
      window.location.replace("/");
      return;
    }

    try {
      localStorage.setItem("token", token);
      console.log("✅ TOKEN GUARDADO:", token);
    } catch (e) {
      console.error("❌ ERROR GUARDANDO TOKEN", e);
    }

    // limpiar URL antes de ir al home
    window.history.replaceState({}, document.title, "/");

    window.location.replace("/");

  }, []);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
      Conectando con Minecraft...
    </div>
  );
}