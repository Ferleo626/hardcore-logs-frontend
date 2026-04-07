import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// 🎨 Estilos nuevos
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
  const navigate = useNavigate();

  const getWorlds = async () => {
    try {
      setLoading(true);
      const res = await API.get("/worlds");
      const sortedWorlds = res.data.sort((a, b) => b.active - a.active);
      setWorlds(sortedWorlds);
    } catch (error) {
      console.error(error);
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
    <>
      <div style={containerStyle}>
        <h1 style={{ 
          fontSize: "3rem", 
          color: "#ffc800", 
          textShadow: "0 0 10px rgba(255, 200, 0, 0.7)", 
          letterSpacing: "3px", 
          fontWeight: "bold",
          textTransform: "uppercase",
          margin: "32px 0", 
          textAlign: "center"
        }}>
          🌍 Mis Mundos Hardcore
        </h1>

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

        {/* Lista de Mundos */}
        {loading ? (
          <p>Cargando mundos...</p>
        ) : worlds.length === 0 ? (
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
      </div>
    </>
  );
}

export default Home;