import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔥 AUTO LOGIN (si ya tiene sesión)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const worldId = localStorage.getItem("worldId");

    if (token && worldId) {
      navigate(`/world/${worldId}`);
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      // 🔐 Guardar datos
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("worldId", res.data.worldId);

      // 🚀 Redirigir al mundo correcto
      navigate(`/world/${res.data.worldId}`);

    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.error || "Error al iniciar sesión"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

export default Login;