import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --- ESTILOS MÍSTICOS (AZUL Y ORO) ---
  const navStyle = {
    padding: "12px 25px",
    background: "linear-gradient(90deg, #001030 0%, #001f5c 100%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    borderBottom: "3px solid #ffc800",
    boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  };

  const buttonStyle = {
    background: "rgba(255, 200, 0, 0.1)",
    border: "1px solid #ffc800",
    color: "#ffc800",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  const logoutStyle = {
    ...buttonStyle,
    border: "1px solid #ff4d4d",
    color: "#ff4d4d",
    background: "rgba(255, 77, 77, 0.1)"
  };

  return (
    <nav style={navStyle}>
      {/* Lado izquierdo: Logo o Título con Oso Xeneize Blindado */}
      <div style={{ 
        color: "#ffc800", 
        fontWeight: "900", 
        fontSize: "1.2rem", 
        letterSpacing: "1px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <span>HARDCORE LOGS</span>
        {/* Contenedor del Oso Xeneize Blindado (con pegamento para gafas) */}
        <span style={{ 
          display: 'grid', 
          gridTemplateAreas: '"icon"', 
          justifyItems: 'center', 
          alignItems: 'center', 
          width: '30px', 
          height: '30px',
          marginLeft: '5px' 
        }}>
          {/* OSO POLAR - Capa base */}
          <span style={{ gridArea: 'icon', fontSize: '1.5rem', zIndex: 1 }}>
            🐻‍❄️
          </span>
          {/* GAFAS DE SOL - Capa superior encimada */}
          <span style={{ 
            gridArea: 'icon', 
            fontSize: '1rem', 
            zIndex: 2, 
            marginTop: '3px', 
            filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.4))' 
          }}>
            🕶️
          </span>
        </span>
      </div>

      {/* Lado derecho: Botones de acción */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button 
          style={buttonStyle} 
          onClick={() => navigate("/")}
          onMouseOver={(e) => {
            e.target.style.background = "#ffc800";
            e.target.style.color = "#001030";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(255, 200, 0, 0.1)";
            e.target.style.color = "#ffc800";
          }}
        >
          🏠 Home
        </button>

        <button 
          style={logoutStyle} 
          onClick={logout}
          onMouseOver={(e) => {
            e.target.style.background = "#ff4d4d";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(255, 77, 77, 0.1)";
            e.target.style.color = "#ff4d4d";
          }}
        >
          🚪 Salir
        </button>
      </div>
    </nav>
  );
}

export default Navbar;