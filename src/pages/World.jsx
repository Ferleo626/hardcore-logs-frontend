import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";
import buttonStyles from "../styles/Button.module.css";
import styles from "./World.module.css";


function World() {
  const { id } = useParams();
  const [newEventId, setNewEventId] = useState(null);
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
  if (t.includes("ENDERMAN")) return "KILL_ENDERMAN";
  // 🔥 FIX REAL
  if (t.includes("NETHER")) return "NETHER";
  if (t.includes("OVERWORLD")) return "ENTER_OVERWORLD";
  if (t.includes("END")) return "END";
  if (t.includes("ANCIENT") || t.includes("DEBRIS")) return "ANCIENT_DEBRIS";

  return t;
};
const getCardType = (type) => {
  switch (type) {
    case "PLAYER_DEATH": return "death";
    case "NETHER": return "nether";
    case "END": return "end";
    case "ENTER_OVERWORLD": return "overworld";
    default: return "default";
  }
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
      case "PLAYER_DEATH": return "/icons/you_died.png";
      case "MINED_DIAMOND": return "/icons/Diamond.png";
      case "ANCIENT_DEBRIS": return "/icons/ancient_debris.png";
      case "NETHER": return "/icons/lava.png";
      case "END": return "/icons/endstone.png";
      case "DRAGON": return "/icons/enderdragon.png";
      case "KILL_ZOMBIE": return "/icons/zombie.png";
      case "KILL_CREEPER": return "/icons/creeper.png";
      case "KILL_SKELETON": return "/icons/skeleton.png";
      case "TOTEM": return "/icons/totem.png";
      case "KILL_ENDERMAN": return "/icons/enderman.png";
      case "ENTER_OVERWORLD": return "/icons/tierra.png";
      default: return "📌";
    }
  };

  const getDescription = (event) => {
  const player = event.player || "Jugador";
  const type = normalizeType(event.type);

  switch (type) {
    case "PLAYER_DEATH":
      return `${player} murió ☠️`;

    case "NETHER":
      return `${player} entró al Nether 🔥`;

    case "END":
      return `${player} entró al End 🌌`;

    case "ENTER_OVERWORLD":
      return `${player} entró al Overworld 🌿`;

    case "MINED_DIAMOND":
      return `${player} encontró diamante 💎`;

    case "ANCIENT_DEBRIS":
      return `${player} encontró Ancient Debris 🔥`;

    case "KILL_ZOMBIE":
      return `${player} mató un Zombie 🧟`;

    case "KILL_CREEPER":
      return `${player} mató un Creeper 💣`;

    case "KILL_SKELETON":
      return `${player} mató un Esqueleto 🏹`;

    default:
      return event.description || "Evento detectado";
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
      case "KILL_ENDERMAN": return "#000000";
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

  newSocket.on("connect", () =>
    console.log("✅ Socket Conectado a:", socketUrl)
  );

  setSocket(newSocket);

  return () => {
    newSocket.disconnect();
  };
}, [id]);

// --- LISTENER DE EVENTOS ---
useEffect(() => {
  if (!socket) return;

  const handleNewEvent = (event) => {
    if (event.worldId !== id) return; // 🔥 FILTRO CLAVE

    console.log("🔥 EVENTO REAL:", event);

    setEvents((prev) => {
      setNewEventId(event._id);
      return prev.some(e => e._id === event._id) ? prev: [event, ...prev];
    });
  };

  socket.on("newEvent", handleNewEvent);

  return () => {
    socket.off("newEvent", handleNewEvent);
  };
}, [socket, id]);
const sortedEvents = [...events].sort(
  (a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date)
);

const firstEvent = sortedEvents[0];
const lastEvent = sortedEvents[sortedEvents.length - 1];

const getDuration = () => {
  if (!firstEvent || !lastEvent) return "0m";

  const start = new Date(firstEvent.createdAt || firstEvent.date);
  const end = new Date(lastEvent.createdAt || lastEvent.date);

  const diffMs = end - start;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);

  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
};

const lastDimension = lastEvent?.dimension || "OVERWORLD";

const isImportantEvent = (type) => {
  const t = normalizeType(type);
  return [
    "PLAYER_DEATH",
    "DRAGON",
    "TOTEM",
    "NETHER",
    "END"
  ].includes(t);
};

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
        {/* ✅ FORMULARIO DE REGISTRO MANUAL CORREGIDO */}
<div className={styles.manualEventForm}>
  <h3 style={{ gridColumn: "1 / -1", marginTop: 0 }}>➕ Registrar Evento Manual</h3>
  
  <input 
    className={styles.input} 
    type="text" 
    placeholder="Tipo (DEATH, DIAMOND...)" 
    value={type} 
    onChange={(e) => setType(e.target.value)} 
  />
  <input 
    className={styles.input} 
    type="text" 
    placeholder="Descripción" 
    value={description} 
    onChange={(e) => setDescription(e.target.value)} 
  />
  <input 
    className={styles.inputShort} 
    type="number" 
    placeholder="X" 
    value={x} 
    onChange={(e) => setX(e.target.value)} 
  />
  <input 
    className={styles.inputShort} 
    type="number" 
    placeholder="Y" 
    value={y} 
    onChange={(e) => setY(e.target.value)} 
  />
  <input 
    className={styles.inputShort} 
    type="number" 
    placeholder="Z" 
    value={z} 
    onChange={(e) => setZ(e.target.value)} 
  />
  <button className={styles.button} onClick={createEvent}>Agregar</button>
</div>
<div style={{
  background: "rgba(0,0,0,0.6)",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "30px",
  border: "2px solid #ffc800",
  boxShadow: "0 0 15px rgba(255,200,0,0.3)"
}}>
  <h3 style={{ color: "#ffc800", marginBottom: "10px" }}>
    🧭 Resumen de la run
  </h3>

  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
    <span>⏱ {getDuration()}</span>
    <span>💀 {deaths}</span>
    <span>💎 {diamonds}</span>
    <span>{getDimensionName(lastDimension)}</span>
  </div>
</div>
        {/* GRID DE ESTADÍSTICAS */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem} style={{ borderLeft: "5px solid #ff4d4d" }}>
            <div className={styles.statLabel}>CAÍDAS DEL OSO ☠️</div>
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
          <div className={styles.statItem} style={{ borderLeft: "5px solid #000000" }}>
            <div className={styles.statLabel}>ENDERMAN 👤</div>
            <div className={styles.statValue} style={{ color: "#00ffff" }}>{endermanKills}</div>
          </div>
          <div className={styles.statItem} style={{ borderLeft: "5px solid #a64dff" }}>
            <div className={styles.statLabel}>ESQUELETOS 🏹</div>
            <div className={styles.statValue} style={{ color: "#a64dff" }}>{skeletonKills}</div>
          </div>
          <div className={styles.statItem} style={{ borderLeft: "5px solid #ffd700" }}>
            <div className={styles.statLabel}>TOTEMS 🗿</div>
            <div className={styles.statValue} style={{ color: "#ffd700" }}>{totem}</div>
          </div>
        </div>

        {/* LISTA DE EVENTOS */}
       <div className={styles.eventList}>
  <div style={{ position: "relative", paddingLeft: "30px" }}>
    
    
    {[...events]
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .map((e) => {
        const important = isImportantEvent(e.type);
        const isNew = e._id === newEventId;

        return (
          <div
            key={e._id}
            style={{
              position: "relative",
              marginBottom: "20px",
              transition: "0.3s"
            }}
          >
            

            <div
                 className={`
  ${styles.card}
  ${styles[getCardType(normalizeType(e.type))]}
  ${isNew ? styles.fadeIn : ""}
  ${isNew ? styles.glow : ""}
  ${isNew && important ? styles.pop : ""}
`}
  style={{
    borderLeft: `6px solid ${getColor(e.type)}`,
    transition: "0.3s"
  }}
>
            
              
              <div className={styles.eventInfo}>
                
                {/* ICONO */}
                <div className={styles.eventIcon}>
                  <img src={getIcon(normalizeType(e.type))} alt="icon" className={styles.eventIconImg}/>
                </div>

                {/* INFO */}
                <div>
                  <h4 className={styles.eventTitle}>
                    {e.player || "Jugador"}
                  </h4>

                  <p className={styles.eventDescription}>
                    {getDescription(e)}
                  </p>

                  {/* INFO DE DIMENSIÓN Y COORDENADAS SEPARADAS */}
<div
  className={styles.eventMeta}
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center"
  }}
>
  {/* Dimensión */}
  <span style={{ ...getDimensionStyle(e.dimension), marginRight: "5px" }}>
    {getDimensionName(e.dimension)}
  </span>

  {/* Coordenadas */}
  <span
    className={styles.coords}
    style={{
      background: "rgba(0,0,0,0.3)",
      padding: "2px 8px",
      borderRadius: "4px"
    }}
  >
    X: {e.x} | Y: {e.y} | Z: {e.z}
  </span>

  {/* Conversión Nether → Overworld */}
  {(e.dimension === "THE_NETHER" || e.dimension === "NETHER") && (
    <span
      style={{
        color: "#aaa",
        fontSize: "0.85rem",
        marginLeft: "5px"
      }}
    >
      (OW: X:{e.x * 8} Z:{e.z * 8})
    </span>
  )}
</div>
                </div>
              </div>

              {/* TIME */}
              <div className={styles.eventTimeContainer}>
                <div className={styles.eventTime}>
                  {formatDate(e.createdAt || e.date)}
                </div>
              </div>

            </div>
          </div>
        );
      })}
  </div>
</div>

      </div>
    </div>
  );
}

export default World;