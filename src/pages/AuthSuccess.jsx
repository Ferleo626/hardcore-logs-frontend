import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      console.log("✅ Token guardado");

      navigate("/dashboard"); // o "/" o donde tengas la app
    } else {
      console.error("❌ No token");
      navigate("/login");
    }

  }, []);

  return <h1>Conectando...</h1>;
}