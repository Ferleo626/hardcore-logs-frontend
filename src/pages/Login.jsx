import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("worldId", res.data.worldId);
      navigate(`/world/${res.data.worldId}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error al iniciar sesión");
    }
  };

  const containerStyle = {
    background: "#001030",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const boxStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "40px",
    borderRadius: "20px",
    border: "2px solid #ffc800",
    boxShadow: "0 0 30px rgba(255, 200, 0, 0.15)",
    textAlign: "center",
    width: "350px"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#111",
    color: "white",
    fontSize: "1rem",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "8px",
    border: "none",
    background: "#0055ff",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "transform 0.2s",
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h1 style={{ color: "#ffc800", marginBottom: "25px", fontSize: "2rem" }}>LOGIN</h1>
        
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button 
          style={buttonStyle} 
          onClick={handleLogin}
          onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
          onMouseOut={(e) => e.target.style.transform = "scale(1)"}
        >
          ENTRAR
        </button>
      </div>
    </div>
  );
}

export default Login;