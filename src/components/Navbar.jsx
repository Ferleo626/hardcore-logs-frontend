import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --- NAVBAR BASE ---
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

  // --- TEXTO LOGO (PIXEL) ---
  const logoText = {
    fontFamily: "'VT323', monospace",
    fontSize: "1.6rem",
    letterSpacing: "2px",
    color: "#ffc800",
    textShadow: "2px 2px 0px #000"
  };

  // --- BOTONES PIXEL ---
  const pixelButton = {
    fontFamily: "'VT323', monospace",
    fontSize: "1.2rem",
    padding: "8px 16px",
    border: "3px solid #000",
    cursor: "pointer",
    color: "#fff",
    imageRendering: "pixelated",
    boxShadow: "inset -3px -3px 0px #222, inset 3px 3px 0px #888",
    transition: "all 0.15s ease"
  };

  const homeStyle = {
    ...pixelButton,
    background: "#5a5a5a"
  };

  const logoutStyle = {
    ...pixelButton,
    background: "#8b0000"
  };

  return (
    <nav style={navStyle}>
      {/* LOGO + OSO POLAR */}
      <div style={{ 
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <span style={logoText}>HARDCORE LOGS</span>

        {/* OSO POLAR CON GAFAS */}
        <span style={{ 
          display: 'grid', 
          placeItems: 'center',
          width: '32px', 
          height: '32px'
        }}>
          {/* OSO */}
          <span style={{ gridArea: '1/1', fontSize: '1.6rem', zIndex: 1 }}>
            🐻‍❄️
          </span>

          {/* GAFAS */}
          <span style={{ 
            gridArea: '1/1',
            fontSize: '1rem',
            marginTop: '4px',
            zIndex: 2,
            filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))'
          }}>
            🕶️
          </span>
        </span>
      </div>

      {/* BOTONES */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          style={homeStyle}
          onClick={() => navigate("/")}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.filter = "brightness(1.2)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.filter = "brightness(1)";
          }}
        >
          🏠 HOME
        </button>

        <button
          style={logoutStyle}
          onClick={logout}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.filter = "brightness(1.2)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.filter = "brightness(1)";
          }}
        >
          🚪 SALIR
        </button>
      </div>
    </nav>
  );
}

export default Navbar;