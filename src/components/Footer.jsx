const footerStyle = {
  backgroundImage: "url('/textures/azul_oscuro.png')",
  backgroundRepeat: "repeat",
  backgroundSize: "auto",

  color: "#ffc800",
  padding: "40px 20px",
  textAlign: "center",

  borderTop: "3px solid #ffc800",
  marginTop: "auto",

  fontFamily: "'VT323', monospace",

  boxShadow: "0 -5px 15px rgba(0,0,0,0.5)"
};

const linkStyle = {
  color: "#ffc800",
  textDecoration: "none",
  margin: "0 12px",
  fontWeight: "bold",
  letterSpacing: "1px"
};

function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <h3 style={{ 
          fontSize: "1.8rem",
          textShadow: "3px 3px 0px #000",
          marginBottom: "15px"
        }}>
          HARDCORE LOGS 🐻‍❄️🕶️
        </h3>

        <p style={{ 
          opacity: 0.8, 
          fontSize: "1rem",
          letterSpacing: "1px"
        }}>
          The ultimate real-time event tracker for Minecraft Hardcore survivors.
        </p>
        
        <div style={{ margin: "20px 0" }}>
          <a href="https://x.com/salmon626_" target="_blank" style={linkStyle}>
            X (Twitter)
          </a>
          <a href="https://twitch.tv/tu_usuario" target="_blank" style={linkStyle}>
            Twitch
          </a>
          <a href="https://github.com/tu_usuario" target="_blank" style={linkStyle}>
            GitHub
          </a>
        </div>

        <hr style={{ 
          borderColor: "rgba(255, 200, 0, 0.3)", 
          margin: "20px 0" 
        }} />
        
        <p style={{ 
          fontSize: "0.9rem", 
          opacity: 0.7,
          textShadow: "2px 2px 0px #000"
        }}>
          © {new Date().getFullYear()} Created with 💙 by <strong>Salmon626</strong>
          <br />
          Proudly Xeneize 🇸🇪⚽
        </p>
      </div>
    </footer>
  );
}

export default Footer;