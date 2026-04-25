import { useState, useEffect } from "react";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);

  // LEVEL SYSTEM
  useEffect(() => {
    if (points >= level * 50) {
      setLevel(level + 1);
    }
  }, [points]);

  // BREATHING GAME
  const [breathing, setBreathing] = useState(false);
  const [phase, setPhase] = useState("Inhale");

  useEffect(() => {
    if (breathing) {
      const interval = setInterval(() => {
        setPhase((p) => (p === "Inhale" ? "Exhale" : "Inhale"));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [breathing]);

  // TAP GAME
  const [target, setTarget] = useState({ x: 50, y: 50 });

  const moveTarget = () => {
    setTarget({
      x: Math.random() * 80,
      y: Math.random() * 70
    });
    setPoints((p) => p + 5);
  };

  // MIND DUMP
  const [dumpText, setDumpText] = useState("");

  // VIDEOS
  const [current, setCurrent] = useState(0);

  const videos = [
    {
      title: "Grounding",
      url: "https://www.youtube.com/embed/30VMIEmA114"
    },
    {
      title: "Breathing",
      url: "https://www.youtube.com/embed/tEmt1Znux58"
    },
    {
      title: "Calm Reset",
      url: "https://www.youtube.com/embed/2OEL4P1Rz04"
    }
  ];

  const nextVideo = () => {
    setCurrent((prev) => (prev + 1) % videos.length);
    setPoints((p) => p + 5);
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2>🎮 Mind Quest</h2>
        <p>⭐ {points} XP | 🏆 Level {level}</p>

        {/* PROGRESS BAR */}
        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${(points % 50) * 2}%`
          }} />
        </div>
      </div>

      {/* HOME */}
      {screen === "home" && (
        <div>
          <h1>Level Up Your Mind</h1>

          <button style={styles.bigBtn} onClick={() => setScreen("breathing")}>
            🧠 Breathing Game
          </button>

          <button style={styles.bigBtn} onClick={() => setScreen("tap")}>
            ⚡ Tap Game
          </button>

          <button style={styles.bigBtn} onClick={() => setScreen("dump")}>
            ✍️ Mind Dump
          </button>

          <button style={styles.bigBtn} onClick={() => setScreen("videos")}>
            🎥 Coping Feed
          </button>
        </div>
      )}

      {/* BREATHING */}
      {screen === "breathing" && (
        <div style={styles.center}>
          <h1>{phase}</h1>

          <div style={{
            width: breathing ? 200 : 120,
            height: breathing ? 200 : 120,
            borderRadius: "50%",
            background: "#22c55e",
            transition: "0.5s"
          }} />

          <button style={styles.bigBtn} onClick={() => {
            setBreathing(!breathing);
            setPoints(p => p + 5);
          }}>
            {breathing ? "Stop" : "Start"} (+5)
          </button>

          <button onClick={() => setScreen("home")}>Back</button>
        </div>
      )}

      {/* TAP GAME */}
      {screen === "tap" && (
        <div style={{ position: "relative", height: "80vh" }}>
          <h2>Tap the circle!</h2>

          <div
            onClick={moveTarget}
            style={{
              position: "absolute",
              left: `${target.x}%`,
              top: `${target.y}%`,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#ec4899"
            }}
          />

          <button onClick={() => setScreen("home")}>Back</button>
        </div>
      )}

      {/* MIND DUMP */}
      {screen === "dump" && (
        <div>
          <h1>Mind Dump</h1>

          <textarea
            value={dumpText}
            onChange={(e) => setDumpText(e.target.value)}
            style={styles.textarea}
            placeholder="Write everything..."
          />

          <button style={styles.bigBtn} onClick={() => {
            if (dumpText) {
              setPoints(p => p + 10);
              setDumpText("");
            }
          }}>
            Release (+10)
          </button>

          <button onClick={() => setScreen("home")}>Back</button>
        </div>
      )}

      {/* VIDEOS */}
      {screen === "videos" && (
        <div>
          <h2>{videos[current].title}</h2>

          <iframe
            width="100%"
            height="250"
            src={videos[current].url}
            style={{ borderRadius: 10 }}
            allowFullScreen
          ></iframe>

          <button style={styles.bigBtn} onClick={nextVideo}>
            Next (+5)
          </button>

          <button onClick={() => setScreen("home")}>Back</button>
        </div>
      )}

    </div>
  );
}

const styles = {
  page: {
    padding: 20,
    background: "#0f172a",
    color: "white",
    minHeight: "100vh"
  },
  header: {
    marginBottom: 20
  },
  bigBtn: {
    width: "100%",
    padding: 16,
    marginTop: 10,
    background: "#22c55e",
    border: "none",
    borderRadius: 10,
    color: "white"
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20
  },
  textarea: {
    width: "100%",
    height: 120,
    marginTop: 10,
    padding: 10,
    borderRadius: 10
  },
  progressBar: {
    width: "100%",
    height: 10,
    background: "#1e293b",
    borderRadius: 10,
    marginTop: 10
  },
  progressFill: {
    height: "100%",
    background: "#22c55e",
    borderRadius: 10
  }
};
