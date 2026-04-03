import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#eee", display: "flex", gap: "10px" }}>
      <button onClick={() => navigate("/")}>Home</button>
      <button onClick={logout}>Cerrar sesión</button>
    </nav>
  );
}

export default Navbar;