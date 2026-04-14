import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    playClick();
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, 120);
  };

  const goHome = () => {
    playClick();
    setTimeout(() => {
      navigate("/");
    }, 120);
  };

  // 🔊 SONIDO CLICK
  const playClick = () => {
    const audio = new Audio("/sounds/click.mp3"); 
    audio.volume = 0.4;
    audio.play();
  };

  // --- NAVBAR ACTUALIZADA CON TEXTURA ---
  const navStyle = {
    padding: "12px 25px",
    // Se reemplaza el degradado por la textura de imagen
    backgroundImage: 'url("/textures/azul_oscuro.png")',
    backgroundRepeat: "repeat",
    backgroundSize: "auto", // Mantiene el tamaño original de los píxeles de la textura
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

  const logoText = {
    fontFamily: "'VT323', monospace",
    fontSize: "1.6rem",
    letterSpacing: "2px",
    color: "#ffc800",
    textShadow: "2px 2px 0px #000"
  };

  const logoImageStyle = {
    width: "40px",
    height: "40px",
    imageRendering: "pixelated",
    objectFit: "contain"
  };

  // 🎮 BOTÓN ESTILO MINECRAFT
  const buttonImageStyle = {
    height: "42px",
    imageRendering: "pixelated",
    cursor: "pointer",
    transition: "all 0.1s ease",
    filter: "drop-shadow(3px 3px 0px #000)"
  };

  // 🖱️ EVENTOS
  const handleHover = (e) => {
    e.currentTarget.style.transform = "scale(1.08)";
    e.currentTarget.style.filter = "brightness(1.2) drop-shadow(3px 3px 0px #000)";
  };

  const handleLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.filter = "drop-shadow(3px 3px 0px #000)";
  };

  const handleMouseDown = (e) => {
    e.currentTarget.style.transform = "scale(0.95) translateY(2px)";
    e.currentTarget.style.filter = "brightness(0.9)";
  };

  const handleMouseUp = (e) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.filter = "brightness(1.2) drop-shadow(3px 3px 0px #000)";
  };

  return (
    <nav style={navStyle}>
      {/* LOGO */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={logoText}>HARDCORE LOGS</span>

        <img
          src="/icons/logo.png"
          alt="Logo"
          style={logoImageStyle}
        />
      </div>

      {/* BOTONES */}
      <div style={{ display: "flex", gap: "14px" }}>
        {/* HOME */}
        <img
          src="/icons/home.png"
          alt="Home"
          style={buttonImageStyle}
          onClick={goHome}
          onMouseOver={handleHover}
          onMouseOut={handleLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />

        {/* SALIR */}
        <img
          src="/icons/logout.png"
          alt="Salir"
          style={buttonImageStyle}
          onClick={logout}
          onMouseOver={handleHover}
          onMouseOut={handleLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      </div>
    </nav>
  );
}

export default Navbar;