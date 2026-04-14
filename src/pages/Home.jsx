import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import buttonStyles from "../styles/Button.module.css";

// 🎨 CONTENEDOR (fondo textura igual que World)
const containerStyle = {
  backgroundImage: "url('/textures/azul_oscuro.png')",
  backgroundRepeat: "repeat",
  backgroundSize: "auto",
  minHeight: "100vh",
  color: "#ffc800",
  padding: "40px 20px",
  textAlign: "center",
  fontFamily: "'VT323', monospace"
};

// 🎮 CARD estilo bloque Minecraft (botón)
const cardStyle = {
  backgroundImage: "url('/textures/azul_oscuro.png')",
  backgroundSize: "cover",

  border: "3px solid #000",
  borderBottom: "5px solid #ffc800",

  padding: "20px",
  margin: "15px auto",
  maxWidth: "600px",

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  boxShadow: `
    inset -5px -5px 0px rgba(0,0,0,0.5),
    inset 5px 5px 0px rgba(255,255,255,0.05)
  `,

  transition: "all 0.1s ease",
  cursor: "pointer"
};

// 🎯 INPUT estilo pixel
const inputStyle = {
  background: "#000d26",
  border: "2px solid #000",
  color: "#fff",
  padding: "10px",
  fontFamily: "'VT323', monospace",
  outline: "none",
  width: "70%",
  marginRight: "10px"
};

function Home() {
  const [worlds, setWorlds] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getWorlds = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/worlds");
      const sortedWorlds = res.data.sort((a, b) => b.active - a.active);
      setWorlds(sortedWorlds);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar los mundos.");
    } finally {
      setLoading(false);
    }
  };

  const createWorld = async () => {
    if (!name.trim()) return;
    try {
      await API.post("/worlds", { name });
      setName("");
      await getWorlds();
    } catch (error) {
      console.error(error);
    }
  };

  const activateWorld = async (id, worldName) => {
    try {
      await API.put(`/worlds/activate/${id}`);
      alert(`✅ Mundo "${worldName}" activado`);
      await getWorlds();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteWorld = async (worldId) => {
    if (!window.confirm("¿Seguro que quieres borrar este mundo?")) return;

    try {
      await API.delete(`/worlds/${worldId}`);
      setWorlds(worlds.filter(w => w._id !== worldId));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWorlds();
  }, []);

  return (
    <div style={containerStyle}>
      
      {/* 🔥 HEADER */}
      <h1 style={{ 
            fontSize: "3.8rem",
            color: "#ffc800",
            textShadow: "4px 4px 0px #000",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "10px",
            fontFamily: "'VT323', monospace",
            fontWeight: "400" // 🔥 clave para VT323
}}>
  {loading ? "CARGANDO..." : "🌍 MIS MUNDOS HARDCORE"}
</h1>

      <p style={{ opacity: 0.8, marginBottom: "30px", letterSpacing: "1px" }}>
        Hardcore Minecraft Tracker Dashboard
      </p>

      {/* ERROR */}
      {!loading && error && (
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ textShadow: "3px 3px 0px #000" }}>
            ERROR DE CONEXIÓN
          </h2>

          <button className={buttonStyles.buttonRetry} onClick={getWorlds}>
            🔄 REINTENTAR
          </button>
        </div>
      )}

      {/* CONTENIDO */}
      {!loading && !error && (
        <>
          {/* CREAR MUNDO */}
          <div style={{ marginBottom: "30px" }}>
            <input
              type="text"
              placeholder="Nombre del nuevo mundo..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />

            <button
              onClick={createWorld}
              style={{
                background: "#0055ff",
                color: "white",
                border: "3px solid #000",
                boxShadow: "inset -3px -3px 0px #003399, inset 3px 3px 0px #6699ff",
                padding: "10px 20px",
                cursor: "pointer",
                fontFamily: "'VT323', monospace"
              }}
            >
              CREAR
            </button>
          </div>

          {/* LISTA */}
          {worlds.length === 0 ? (
            <p>No hay mundos todavía.</p>
          ) : (
            worlds.map((w) => (
              <div
                key={w._id}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.filter = "brightness(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                <div
                  onClick={() => navigate(`/world/${w._id}`)}
                  style={{ flex: 1, textAlign: "left" }}
                >
                  <span style={{ 
                    fontSize: "1.4rem",
                    textShadow: "3px 3px 0px #000"
                  }}>
                    {w.name}
                  </span>

                  {w.active && (
                    <span style={{
                      marginLeft: "10px",
                      background: "#22c55e",
                      padding: "4px 10px",
                      border: "2px solid #000",
                      fontSize: "0.7rem",
                      boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.4)"
                    }}>
                      ACTIVO
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  {!w.active && (
                    <button
                      onClick={() => activateWorld(w._id, w.name)}
                      style={{
                        background: "#444",
                        color: "white",
                        border: "3px solid #000",
                        padding: "8px 15px",
                        cursor: "pointer",
                        fontFamily: "'VT323', monospace"
                      }}
                    >
                      USAR
                    </button>
                  )}

                  <button
                    onClick={() => deleteWorld(w._id)}
                    style={{
                      background: "#ff4d4d",
                      color: "white",
                      border: "3px solid #000",
                      boxShadow: "inset -3px -3px 0px #992222, inset 3px 3px 0px #ff8080",
                      padding: "8px 15px",
                      cursor: "pointer",
                      fontFamily: "'VT323', monospace"
                    }}
                  >
                    BORRAR
                  </button>
                </div>
              </div>
            ))
          )}

          <p style={{ marginTop: "20px", fontSize: "0.9rem", opacity: 0.7 }}>
            Haz clic en un mundo para ver detalles.
          </p>
        </>
      )}
    </div>
  );
}

export default Home;