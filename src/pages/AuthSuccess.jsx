import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    console.log("📍 URL COMPLETA:", window.location.href);

    const token = new URLSearchParams(window.location.search).get("token");

    console.log("🎯 TOKEN EXTRAÍDO:", token);

    if (!token) {
      console.log("❌ NO LLEGA TOKEN");
      window.location.replace("/");
      return;
    }

    localStorage.setItem("token", token);

    console.log("💾 TOKEN GUARDADO:", localStorage.getItem("token"));

    setTimeout(() => {
      window.location.replace("/");
    }, 200);
  }, []);

  return <h1>Conectando...</h1>;
}