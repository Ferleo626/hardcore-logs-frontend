import { useEffect } from "react";

export default function AuthSuccess() {

  useEffect(() => {

    setTimeout(() => {

      const token = new URLSearchParams(window.location.search).get("token");

      console.log("TOKEN:", token);

      if (!token) {
        window.location.replace("/");
        return;
      }

      localStorage.setItem("token", token);

      console.log("GUARDADO OK");

      window.location.replace("/");

    }, 300); // 🔥 delay evita race condition

  }, []);

  return <h1>Conectando...</h1>;
}