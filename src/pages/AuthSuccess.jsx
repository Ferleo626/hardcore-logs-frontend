import { useEffect } from "react";

export default function AuthSuccess() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token || token.includes("error")) {
      window.location.href = "/login";
      return;
    }

    localStorage.setItem("token", token);

    console.log("✅ Token guardado");

    // 🔥 IMPORTANTE: usar window.location (NO navigate)
    setTimeout(() => {
      window.location.href = "/";
    }, 200);

  }, []);

  return <h1>Conectando...</h1>;
}