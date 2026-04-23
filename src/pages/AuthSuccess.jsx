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

      navigate("/");
    } else {
      navigate("/");
    }
  }, []);

  return <h1>Conectando...</h1>;
}