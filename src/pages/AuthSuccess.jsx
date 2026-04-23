import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // 🔥 Redirección sin recargar la app
      navigate("/", { replace: true });
    }
  }, []);

  return <h1>Conectando...</h1>;
}