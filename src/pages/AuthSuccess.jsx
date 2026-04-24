import { useEffect } from "react";

export default function AuthSuccess() {

  useEffect(() => {

    console.log("🔥 AUTH SUCCESS MOUNTED");
    console.log("URL:", window.location.href);

    const token = new URLSearchParams(window.location.search).get("token");

    console.log("TOKEN DETECTADO:", token);

    alert("TOKEN: " + token);

  }, []);

  return (
    <div style={{ color: "white" }}>
      AUTH DEBUG PAGE
    </div>
  );
}