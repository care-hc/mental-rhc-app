import { useState } from "react";

const pink = "#ec4899";
const purple = "#8b5cf6";
const dark = "#111827";

const copingSkills = [
  "5-4-3-2-1 Grounding",
  "Box Breathing",
  "Music Reset",
  "Journal It Out",
  "Cold Water Reset",
  "Text Someone Safe"
];

const screenings = {
  phq9: { title: "Mood Check", items: 9 },
  gad7: { title: "Anxiety Check", items: 7 },
  cssrs: { title: "Safety Check", items: 5 }
};

const resources = [
  "988 Suicide & Crisis Lifeline",
  "911 Emergency",
  "Resilient Health Care Services: 925-732-6422"
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [consent, setConsent] = useState(false);
  const [screen, setScreen] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const total = Object.values(answers).reduce((a, b) => a + Number(b || 0), 0);

  const Nav = () => (
    <div style={styles.nav}>
      <button style={styles.navBtn} onClick={() => setTab("home")}>Home</button>
      <button style={styles.navBtn} onClick={() => setTab("coping")}>Coping</button>
      <button style={styles.plusBtn} onClick={() => setTab("screen")}>+</button>
      <button style={styles.navBtn} onClick={() => setTab("progress")}>Progress</button>
      <button style={styles.navBtn} onClick={() => setTab("help")}>Help</button>
    </div>
  );

  if (!consent) {
    return (
      <div style={styles.page}>
        <div style={styles.consentCard}>
          <img src="/logo.png" style={styles.logo} />
          <h1>Welcome to Resilient Wellness</h1>
          <p>
            This app supports coping skills, mental health check-ins, and crisis routing.
            It does not replace emergency care or diagnosis.
          </p>
          <button style={styles.primaryBtn} onClick={() => setConsent(true)}>
            Agree & Continue
          </button>
        </div>
      </div>
    );
  }

  if (tab === "home") {
    return (
      <div style={styles.page}>
        <div style={styles.hero}>
          <img src="/logo.png" style={styles.logoSmall} />
          <div style={styles.overlay}>
            <p style={styles.tag}>Teen Wellness Support</p>
            <h1>Take care of your mind.</h1>
            <p>You are not alone. Small steps count.</p>
          </div>
        </div>

        <div style={styles.quoteCard}>
          <h2>You are stronger than you think.</h2>
          <p>Pause. Breathe. Keep going.</p>
        </div>

        <div style={styles.grid}>
          <button style={styles.card} onClick={() => setTab("screen")}>Daily Check-In</button>
          <button style={styles.card} onClick={() => setTab("coping")}>Coping Skills</button>
          <button style={styles.card} onClick={() => setTab("progress")}>Progress</button>
          <button style={styles.card} onClick={() => setTab("help")}>Get Help</button>
        </div>

        <Nav />
      </div>
    );
  }

  if (tab === "coping") {
    return (
      <div style={styles.page}>
        <h1>Coping Tools</h1>
        <div style={styles.photoCard}>
          <h2>Reset your mind</h2>
          <p>Pick one skill. Try it for two minutes.</p>
        </div>

        {copingSkills.map((skill, i) => (
          <div key={i} style={styles.listCard}>
            <strong>{skill}</strong>
            <p>Practice this when emotions feel heavy.</p>
          </div>
        ))}

        <Nav />
      </div>
    );
  }

  if (tab === "screen") {
    if (!screen) {
      return (
        <div style={styles.page}>
          <h1>Check In</h1>
          <p style={styles.subtext}>Choose a quick screening tool.</p>

          {Object.keys(screenings).map((key) => (
            <button key={key} style={styles.bigButton} onClick={() => setScreen(key)}>
              {screenings[key].title}
            </button>
          ))}

          <Nav />
        </div>
      );
    }

    return (
      <div style={styles.page}>
        <h1>{screenings[screen].title}</h1>

        {score === null ? (
          <>
            {Array.from({ length: screenings[screen].items }).map((_, i) => (
              <input
                key={i}
                type="number"
                min="0"
                max="3"
                placeholder={`Question ${i + 1}: 0-3`}
                style={styles.input}
                onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
              />
            ))}

            <button style={styles.primaryBtn} onClick={() => setScore(total)}>
              Submit
            </button>
          </>
        ) : (
          <div style={styles.resultCard}>
            <h2>Your Score: {score}</h2>
            <p>This is a wellness check-in, not a diagnosis.</p>
            <button style={styles.primaryBtn} onClick={() => { setScreen(null); setScore(null); setAnswers({}); }}>
              New Check-In
            </button>
          </div>
        )}

        <Nav />
      </div>
    );
  }

  if (tab === "progress") {
    return (
      <div style={styles.page}>
        <h1>Progress</h1>
        <div style={styles.quoteCard}>
          <h2>Every check-in matters.</h2>
          <p>Your emotional health deserves attention.</p>
        </div>
        <Nav />
      </div>
    );
  }

  if (tab === "help") {
    return (
      <div style={styles.page}>
        <h1>Get Help Now</h1>

        {resources.map((r, i) => (
          <div key={i} style={styles.alertCard}>
            {r}
          </div>
        ))}

        <a href="tel:9257326422" style={styles.callBtn}>
          Call Clinic
        </a>

        <Nav />
      </div>
    );
  }

  return null;
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "22px",
    paddingBottom: "110px",
    background: "linear-gradient(180deg, #fff1f7, #f4efff)",
    color: dark,
    fontFamily: "Arial, sans-serif"
  },
  hero: {
    minHeight: "360px",
    borderRadius: "28px",
    backgroundImage: "linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.55)), url('/hero.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "white",
    boxShadow: "0 20px 40px rgba(0,0,0,.18)"
  },
  overlay: {
    background: "rgba(0,0,0,.35)",
    padding: "20px",
    borderRadius: "22px",
    backdropFilter: "blur(8px)"
  },
  tag: {
    color: "#f9a8d4",
    fontWeight: "bold"
  },
  logo: {
    width: "180px",
    display: "block",
    margin: "0 auto 20px"
  },
  logoSmall: {
    width: "120px",
    background: "rgba(255,255,255,.8)",
    borderRadius: "16px",
    padding: "8px"
  },
  consentCard: {
    background: "white",
    padding: "28px",
    borderRadius: "28px",
    boxShadow: "0 20px 40px rgba(0,0,0,.12)",
    textAlign: "center"
  },
  quoteCard: {
    marginTop: "20px",
    padding: "24px",
    borderRadius: "26px",
    color: "white",
    background: `linear-gradient(135deg, ${pink}, ${purple})`,
    boxShadow: "0 16px 35px rgba(236,72,153,.28)"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginTop: "20px"
  },
  card: {
    background: "white",
    border: "none",
    borderRadius: "22px",
    padding: "24px",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 12px 24px rgba(0,0,0,.09)"
  },
  photoCard: {
    minHeight: "220px",
    borderRadius: "26px",
    padding: "24px",
    color: "white",
    backgroundImage: "linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.55)), url('/calm.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    marginBottom: "18px"
  },
  listCard: {
    background: "white",
    padding: "18px",
    borderRadius: "20px",
    marginTop: "12px",
    boxShadow: "0 10px 22px rgba(0,0,0,.08)"
  },
  bigButton: {
    width: "100%",
    padding: "20px",
    marginTop: "14px",
    border: "none",
    borderRadius: "20px",
    background: "white",
    fontSize: "18px",
    fontWeight: "bold",
    boxShadow: "0 10px 22px rgba(0,0,0,.08)"
  },
  input: {
    width: "100%",
    padding: "16px",
    marginTop: "10px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    fontSize: "16px"
  },
  primaryBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "16px",
    border: "none",
    borderRadius: "18px",
    color: "white",
    background: `linear-gradient(135deg, ${pink}, ${purple})`,
    fontSize: "17px",
    fontWeight: "bold"
  },
  resultCard: {
    background: "white",
    padding: "24px",
    borderRadius: "24px",
    marginTop: "20px"
  },
  alertCard: {
    background: "#fff",
    padding: "18px",
    borderRadius: "18px",
    marginTop: "12px",
    borderLeft: `6px solid ${pink}`,
    boxShadow: "0 10px 22px rgba(0,0,0,.08)"
  },
  callBtn: {
    display: "block",
    textAlign: "center",
    marginTop: "20px",
    padding: "18px",
    borderRadius: "20px",
    background: "#ef4444",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold"
  },
  nav: {
    position: "fixed",
    bottom: "18px",
    left: "18px",
    right: "18px",
    background: "rgba(255,255,255,.95)",
    borderRadius: "30px",
    padding: "12px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,.18)"
  },
  navBtn: {
    background: "transparent",
    border: "none",
    fontWeight: "bold",
    color: "#6b7280"
  },
  plusBtn: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "none",
    background: `linear-gradient(135deg, ${pink}, ${purple})`,
    color: "white",
    fontSize: "30px"
  },
  subtext: {
    color: "#6b7280"
  }
};
