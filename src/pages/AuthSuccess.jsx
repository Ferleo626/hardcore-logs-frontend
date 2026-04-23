import { useEffect } from "react";

export default function AuthSuccess() {

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token || token.includes("error")) {
      console.error("❌ Token inválido");

      // 🔥 fallback limpio (NO /login)
      window.location.replace("/");
      return;
    }

    localStorage.setItem("token", token);

    console.log("✅ Token guardado");

    // 🔥 replace evita loops
    window.location.replace("/");
  }, []);

  return <h1>Conectando...</h1>;
}