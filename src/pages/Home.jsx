import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import buttonStyles from "../styles/Button.module.css";

// 🎨 Estilos
const containerStyle = {
  background: "radial-gradient(circle at center, #001f5c 0%, #001030 100%)",
  minHeight: "100vh",
  color: "#f0f0f0",
  padding: "40px 20px",
  textAlign: "center",
  fontFamily: "Roboto, sans-serif"
};

const cardStyle = {
  background: "rgba(10, 10, 10, 0.85)",
  borderRadius: "15px",
  padding: "20px",
  margin: "15px auto",
  maxWidth: "600px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "3px solid #ffc800",
  boxShadow: "0 4px 15px rgba(0,0,0,0.5)"
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ffc800",
  background: "rgba(255,255,255,0.1)",
  color: "white",
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
      setError("No se pudo cargar los mundos. Verifica tu conexión o el servidor.");
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
      alert("Error al crear el mundo.");
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
      
      {/* 🔥 HEADER DINÁMICO */}

             <h1 style={{ 
              fontFamily: "'Press Start 2P', cursive", // Cambiamos Roboto por esta
              fontSize: "1.8rem", // Al ser más ancha, bajamos un poco el tamaño para que no desborde
              color: "#ffc800", 
              textShadow: "4px 4px 0px #000", // Sombra sólida tipo bloque
              letterSpacing: "2px", 
              textTransform: "uppercase",
              marginBottom: "10px"
}}>
  {loading ? "CARGANDO..." : "🌍 MIS MUNDOS HARDCORE"}
</h1>

      <p style={{ opacity: 0.7, marginBottom: "30px" }}>
        Hardcore Minecraft Tracker Dashboard
      </p>

      {/* 🔥 ESTADO ERROR */}
      {!loading && error && (
  <div style={{ textAlign: "center", marginBottom: "30px" }}>
    <h1 style={{ color: "#ffc800", fontSize: "2rem", textShadow: "0 0 12px rgba(255,0,0,0.8)" }}>
      ERROR DE CONEXIÓN
    </h1>

    <button className={buttonStyles.buttonRetry} onClick={getWorlds}>
      🔄 REINTENTAR CONEXIÓN
    </button>
  </div>
)}
      {/* 🔥 CONTENIDO SOLO SI NO HAY ERROR */}
      {!loading && !error && (
        <>
          {/* Crear mundo */}
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
                padding: "12px 20px",
                background: "#ffc800",
                color: "#001030",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Crear
            </button>
          </div>

          {/* Lista de mundos */}
          {worlds.length === 0 ? (
            <p>No hay mundos todavía.</p>
          ) : (
            worlds.map((w) => (
              <div key={w._id} style={cardStyle}>
                <div
                  onClick={() => navigate(`/world/${w._id}`)}
                  style={{ cursor: "pointer", flex: 1, textAlign: "left" }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    {w.name}
                  </span>

                  {w.active && (
                    <span style={{
                      marginLeft: "10px",
                      background: "#27ae60",
                      padding: "3px 8px",
                      borderRadius: "10px",
                      fontSize: "0.75rem",
                      fontWeight: "bold"
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
                        padding: "8px 15px",
                        background: "#444",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Usar
                    </button>
                  )}

                  <button
                    onClick={() => deleteWorld(w._id)}
                    style={{
                      padding: "8px 15px",
                      background: "#ff4444",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))
          )}

          <p style={{ marginTop: "20px", fontSize: "0.85rem", opacity: 0.7 }}>
            Haz clic en un mundo para ver detalles.
          </p>
        </>
      )}
    </div>
  );
}

export default Home;