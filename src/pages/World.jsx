import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";
import buttonStyles from "../styles/Button.module.css";
import styles from "./World.module.css";


function World() {
  const { id } = useParams();

  const [world, setWorld] = useState(null);
  const [events, setEvents] = useState([]);
  const [socket, setSocket] = useState(null);

  const [loadingWorld, setLoadingWorld] = useState(true);
  const [worldError, setWorldError] = useState(false);

  // Estados del formulario manual
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [z, setZ] = useState("");

  // --- FUNCIONES AUXILIARES ---
  const normalizeType = (type) => {
    if (!type) return "UNKNOWN";
    const t = type.toUpperCase().replace(/\s+/g, '_');
    if (["DEATH", "PLAYER_DEATH"].includes(t)) return "PLAYER_DEATH";
    if (["DIAMOND", "MINED_DIAMOND"].includes(t)) return "MINED_DIAMOND";
    if (t.includes("ZOMBIE")) return "KILL_ZOMBIE";
    if (t.includes("SKELETON")) return "KILL_SKELETON";
    if (t.includes("CREEPER")) return "KILL_CREEPER";
    if (t.includes("NETHER")) return "THE_NETHER";
    if (t.includes("END")) return "END";
    if (t.includes("ANCIENT") || t.includes("DEBRIS")) return "ANCIENT_DEBRIS";
    return t;
  };

  const formatDate = (date) => {
    if (!date) return "Fecha desconocida";
    return new Date(date).toLocaleString("es-AR", {
      hour: "2-digit", minute: "2-digit", hour12: false,
      day: "2-digit", month: "2-digit", year: "numeric"
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case "PLAYER_DEATH": return "🐻‍❄️🕶️";
      case "MINED_DIAMOND": return "💎";
      case "ANCIENT_DEBRIS": return "🔥";
      case "NETHER": return "🌋";
      case "END": return "🌌";
      case "DRAGON": return "🐉";
      case "KILL_ZOMBIE": return "🧟";
      case "KILL_CREEPER": return "💣";
      case "KILL_SKELETON": return "🏹";
      case "LOW_HP": return "❤️";
      case "TOTEM": return "🧿";
      default: return "📌";
    }
  };

  const getDescription = (event) => {
    switch (event.type) {
      case "PLAYER_DEATH": return "Murió 💀 (El Oso cayó)";
      case "MINED_DIAMOND": return "Encontró diamante 💎";
      case "ANCIENT_DEBRIS": return "Encontró Ancient Debris 🔥";
      case "NETHER": return "Entró al Nether 🔥";
      case "THE_NETHER": return "Entró al Nether 🔥";
      case "END": return "Entró al End 🌌";
      case "DRAGON": return "Mató al dragón 🐉";
      case "KILL_ZOMBIE": return "Mató un Zombie 🧟";
      case "KILL_CREEPER": return "Mató un Creeper 💣";
      case "KILL_SKELETON": return "Mató un Esqueleto 🏹";
      case "LOW_HP": return "Estuvo al borde de la muerte ❤️";
      default: return event.description || "Evento detectado";
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "PLAYER_DEATH":
      case "DEATH": return "#ff4d4d";
      case "MINED_DIAMOND": return "#00ffff";
      case "ANCIENT_DEBRIS": return "#ff9900";
      case "DRAGON": return "#a64dff";
      case "TOTEM": return "#ffd700";
      default: return "white";
    }
  };

  const getDimensionName = (dim) => {
    if (!dim) return "🌿 Overworld";
    const d = dim.toUpperCase();
    if (d.includes("THE_NETHER")) return "🔥 Nether";
    if (d.includes("END")) return "🌌 End";
    return "🌿 Overworld";
  };

  const getDimensionStyle = (dim) => {
    if (dim === "NETHER" || dim === "THE_NETHER") return { color: "#ff4d4d", fontWeight: "bold" };
    if (dim === "END" || dim === "THE_END") return { color: "#a64dff", fontWeight: "bold" };
    return { color: "#55ff55", fontWeight: "bold" };
  };

  // --- LLAMADAS A API ---
  const getEvents = async () => {
    if (!id) return;
    try {
      const res = await API.get(`/events/${id}`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
    }
  };

  const getWorld = async () => {
    if (!id) return;
    try {
      const res = await API.get(`/worlds/${id}`);
      setWorld(res.data);
    } catch (err) {
      console.error("Error al obtener mundo:", err);
      throw err;
    }
  };

  const getWorldData = async () => {
    setLoadingWorld(true);
    setWorldError(false);
    try {
      await getWorld();
      await getEvents();
    } catch (err) {
      setWorldError(true);
    } finally {
      setLoadingWorld(false);
    }
  };

  const createEvent = async () => {
    if (!type) return;
    try {
      await API.post("/events", {
        type, description,
        x: Number(x), y: Number(y), z: Number(z),
        worldId: id
      });
      setType(""); setDescription(""); setX(""); setY(""); setZ("");
    } catch (err) {
      console.error("Error al crear evento:", err);
    }
  };

  // --- SOCKET.IO ---
  useEffect(() => {
    if (!id) return;

    const socketUrl = import.meta.env.VITE_API_URL
      ? "https://hardcore-logs-backend.onrender.com"
      : "http://localhost:4000";

    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"]
    });

    newSocket.on("connect", () => console.log("✅ Socket Conectado a:", socketUrl));
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewEvent = (event) => {
  if (event.worldId !== id) return; // 🔥 FILTRO CLAVE

  console.log("🔥 EVENTO REAL:", event);
  setEvents(prev => [event, ...prev]);
};
    socket.on("newEvent", handleNewEvent);

    return () => socket.off("newEvent", handleNewEvent);
  }, [socket]);

  // --- CONTADORES ---
  const deaths = events.filter(e => normalizeType(e.type) === "PLAYER_DEATH").length;
  const diamonds = events.filter(e => normalizeType(e.type) === "MINED_DIAMOND").length;
  const debris = events.filter(e => normalizeType(e.type) === "ANCIENT_DEBRIS").length;
  const zombieKills = events.filter(e => normalizeType(e.type) === "KILL_ZOMBIE").length;
  const creeperKills = events.filter(e => normalizeType(e.type) === "KILL_CREEPER").length;
  const skeletonKills = events.filter(e => normalizeType(e.type) === "KILL_SKELETON").length;
  const dragon = events.filter(e => normalizeType(e.type) === "DRAGON").length;
  const totem = events.filter(e => normalizeType(e.type) === "TOTEM").length;
  const endermanKills = events.filter(e => normalizeType(e.type) === "KILL_ENDERMAN").length;

  // --- INICIALIZACIÓN ---
  useEffect(() => { getWorldData(); }, [id]);

  // --- RENDER ---
  return (
    <div className={styles.container}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <header className={styles.header}>
  <h1 className={styles.headerTitle}>
    {loadingWorld ? "CARGANDO..." : world ? world.name.toUpperCase() : worldError ? "ERROR DE CONEXIÓN" : "MUNDO DETECTADO"}
  </h1>

  {/* BOTÓN DE REINTENTAR */}
  {worldError && (
    <button className={buttonStyles.buttonRetry} onClick={getWorldData}>
      🔄 Reintentar conexión
    </button>
  )}

  <p className={styles.headerSubtitle}>Real-Time Minecraft Hardcore Event Tracker & Dashboard</p>
</header>
        {/* FORMULARIO DE REGISTRO MANUAL */}
        <div className={styles.statItem} style={{ marginBottom: "30px", borderLeft: "5px solid #ffd700" }}>
          <h3 style={{ marginTop: 0 }}>➕ Registrar Evento Manual</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input className={styles.input} type="text" placeholder="Tipo (DEATH, DIAMOND...)" value={type} onChange={(e) => setType(e.target.value)} />
            <input className={styles.input} type="text" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input className={styles.inputShort} type="number" placeholder="X" value={x} onChange={(e) => setX(e.target.value)} />
            <input className={styles.inputShort} type="number" placeholder="Y" value={y} onChange={(e) => setY(e.target.value)} />
            <input className={styles.inputShort} type="number" placeholder="Z" value={z} onChange={(e) => setZ(e.target.value)} />
            <button className={styles.button} onClick={createEvent}>Agregar</button>
          </div>
        </div>

        {/* GRID DE ESTADÍSTICAS */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem} style={{ borderLeft: "5px solid #ff4d4d" }}>
            <div className={styles.statLabel}>CAÍDAS DEL OSO</div>
            <div className={styles.statValue} style={{ color: "#ff4d4d" }}>{deaths}</div>
          </div>

          <div className={styles.statItem} style={{ borderLeft: "5px solid #00ffff" }}>
            <div className={styles.statLabel}>DIAMANTES 💎</div>
            <div className={styles.statValue} style={{ color: "#00ffff" }}>{diamonds}</div>
          </div>

          <div className={styles.statItem} style={{ borderLeft: "5px solid #ff9900" }}>
            <div className={styles.statLabel}>NETHERITE 🔥</div>
            <div className={styles.statValue} style={{ color: "#ff9900" }}>{debris}</div>
          </div>

          <div className={styles.statItem} style={{ borderLeft: "5px solid #55ff55" }}>
            <div className={styles.statLabel}>ZOMBIES 🧟</div>
            <div className={styles.statValue}>{zombieKills}</div>
          </div>
          <div className={styles.statItem} style={{ borderLeft: "5px solid #a64dff" }}>
            <div className={styles.statLabel}>DRAGONES 🐉</div>
            <div className={styles.statValue} style={{ color: "#a64dff" }}>{dragon}</div>
          </div>
          <div className={styles.statItem} style={{ borderLeft: "5px solid #ff4d4d" }}>
            <div className={styles.statLabel}>CREEPERS 💣</div>
            <div className={styles.statValue} style={{ color: "#ff4d4d" }}>{creeperKills}</div>
          </div>
          <div className={styles.statItem} style={{ borderLeft: "5px solid #00ffff" }}>
            <div className={styles.statLabel}>ENDERMAN 🤖</div>
            <div className={styles.statValue} style={{ color: "#00ffff" }}>{endermanKills}</div>
          </div>
          <div className={styles.statItem} style={{ borderLeft: "5px solid #a64dff" }}>
            <div className={styles.statLabel}>ESQUELETOS 🏹</div>
            <div className={styles.statValue} style={{ color: "#a64dff" }}>{skeletonKills}</div>
          </div>
          <div className={styles.statItem} style={{ borderLeft: "5px solid #ffd700" }}>
            <div className={styles.statLabel}>TOTEMS 🧿</div>
            <div className={styles.statValue} style={{ color: "#ffd700" }}>{totem}</div>
          </div>
        </div>

        {/* LISTA DE EVENTOS */}
        <div className={styles.eventList}>
          {[...events]
            .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
            .map((e) => (
              <div key={e._id} className={styles.card} style={{ borderLeft: `6px solid ${getColor(e.type)}` }}>
                <div className={styles.eventInfo}>
                  <div className={styles.eventIcon} style={{
                    display: 'grid',
                    gridTemplateAreas: "icon",
                    justifyItems: 'center',
                    alignItems: 'center',
                    width: '80px',
                    height: '80px'
                  }}>
                    {e.type === "PLAYER_DEATH" ? (
                      <>
                        <span style={{ gridArea: 'icon', fontSize: '3rem', position: 'relative', zIndex: 1 }}>🐻‍❄️</span>
                        <span style={{ gridArea: 'icon', fontSize: '2rem', position: 'relative', zIndex: 2, marginTop: '10px', filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))' }}>🕶️</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '2.5rem', gridArea: 'icon' }}>{getIcon(e.type)}</span>
                    )}
                  </div>

                  <div>
                    <h4 className={styles.eventTitle} style={{ color: getColor(e.type) }}>
                      {normalizeType(e.type).replace(/_/g, " ")}
                    </h4>
                    <p className={styles.eventDescription}>{getDescription(e)}</p>
                    <div className={styles.eventMeta}>
                      <span style={getDimensionStyle(e.dimension)}>{getDimensionName(e.dimension)}</span>
                      <span className={styles.coords}>X: {e.x} | Y: {e.y} | Z: {e.z}</span>
                      {(e.dimension === "THE_NETHER" || e.dimension === "NETHER") && (
                        <span style={{ color: "#aaa" }}> (OW: X:{e.x * 8} Z:{e.z * 8})</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.eventTimeContainer}>
                  <div className={styles.eventTime}>{formatDate(e.createdAt || e.date)}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default World;