const footerStyle = {
  background: "#001030", // Azul Boca profundo
  color: "#f0f0f0",
  padding: "40px 20px",
  textAlign: "center",
  borderTop: "3px solid #ffc800", // Franja Amarilla Oro
  marginTop: "auto"
};

const linkStyle = {
  color: "#ffc800",
  textDecoration: "none",
  margin: "0 10px",
  fontWeight: "bold"
};

function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h3 style={{ color: "#ffc800", marginBottom: "15px" }}>HARDCORE LOGS 🐻‍❄️🕶️</h3>
        <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>
          The ultimate real-time event tracker for Minecraft Hardcore survivors.
        </p>
        
        <div style={{ margin: "20px 0" }}>
          {/* Reemplazá con tus redes reales */}
          <a href="https://x.com/salmon626_" target="_blank" style={linkStyle}>X (Twitter)</a>
          <a href="https://twitch.tv/tu_usuario" target="_blank" style={linkStyle}>Twitch</a>
          <a href="https://github.com/tu_usuario" target="_blank" style={linkStyle}>GitHub</a>
        </div>

        <hr style={{ borderColor: "rgba(255, 200, 0, 0.2)", margin: "20px 0" }} />
        
        <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>
          © {new Date().getFullYear()} Created with 💙 by <strong>Salmon626</strong>. 
          <br />
          Proudly Xeneize 🇸🇪⚽
        </p>
      </div>
    </footer>
  );
}

export default Footer;