import { useEffect } from "react";

export default function AuthSuccess() {

  useEffect(() => {

    console.log("🔥 AUTH SUCCESS MOUNTED");
    console.log("URL:", window.location.href);

    const token = new URLSearchParams(window.location.search).get("token");

    console.log("TOKEN DETECTADO:", token);
console.log("TOKEN GUARDADO ANTES:", localStorage.getItem("token"));

localStorage.setItem("token", token);

console.log("TOKEN GUARDADO DESPUÉS:", localStorage.getItem("token"));
    alert("TOKEN: " + token);

  }, []);

  return (
    <div style={{ color: "white" }}>
      AUTH DEBUG PAGE
    </div>
  );
}