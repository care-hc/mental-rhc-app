import { useEffect, useState, useRef } from "react";

/**********************
 RESILIENT HEALTH CARE SERVICES
 WELLNESS ARCADE PLATFORM
***********************/

const CONSENT_TEXT = `This platform supports mental health screening, coping skills, and crisis routing. It does not replace emergency care or diagnosis.`;

const copingSkills = [
  { category: "Anxiety", skill: "5-4-3-2-1 Grounding" },
  { category: "Anxiety", skill: "Box Breathing" },
  { category: "Stress", skill: "Muscle Relaxation" },
  { category: "Depression", skill: "Behavioral Activation" },
  { category: "Panic", skill: "Cold Water Reset" },
  { category: "Emotions", skill: "Brain Dump" }
];

const screenings = {
  phq9: { title: "PHQ-9", items: 9 },
  gad7: { title: "GAD-7", items: 7 },
  asrs: { title: "ASRS", items: 6 },
  cssrs: { title: "C-SSRS", items: 5 }
};

const resources = {
  crisis: ["988 Lifeline", "911 Emergency"],
  clinic: "Resilient Health Care Services - 925-732-6422"
};

const interpret = (type, score) => {
  if (type === "phq9") return score < 5 ? "Minimal" : score < 10 ? "Mild" : score < 15 ? "Moderate" : "Severe";
  if (type === "gad7") return score < 5 ? "Minimal" : score < 10 ? "Mild" : score < 15 ? "Moderate" : "Severe";
  if (type === "cssrs") return score >= 2 ? "HIGH RISK" : "Low Risk";
  return "Reviewed";
};

export default function App() {
  const [consent, setConsent] = useState(false);
  const [tab, setTab] = useState("home");
  const [screen, setScreen] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [result, setResult] = useState("");
  const dumpRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("dump");
    if (dumpRef.current && saved) dumpRef.current.value = saved;
  }, []);

  const submit = () => {
    const total = Object.values(answers).reduce((a, b) => a + Number(b || 0), 0);
    setScore(total);
    setResult(interpret(screen, total));

    const history = JSON.parse(localStorage.getItem("history") || "[]");
    history.push({ screen, total, result });
    localStorage.setItem("history", JSON.stringify(history));

    if (screen === "cssrs" && total >= 2) setTab("resources");
  };

  const exportData = () => {
    const data = localStorage.getItem("history");
    const blob = new Blob([data || "[]"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clinical_export.json";
    a.click();
  };

  const Nav = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "space-around", background: "#fff", borderTop: "1px solid #ccc", padding: 10 }}>
      <button onClick={() => setTab("home")}>Home</button>
      <button onClick={() => setTab("coping")}>Coping</button>
      <button onClick={() => setTab("screen")}>Screen</button>
      <button onClick={() => setTab("analytics")}>Analytics</button>
      <button onClick={() => setTab("resources")}>Help</button>
    </div>
  );

  if (!consent) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Consent</h2>
        <p>{CONSENT_TEXT}</p>
        <button onClick={() => setConsent(true)}>Agree & Continue</button>
      </div>
    );
  }

  if (tab === "home") {
    return <div style={{ padding: 20 }}><h1>Enterprise Wellness Platform</h1><Nav /></div>;
  }

  if (tab === "coping") {
    return (
      <div style={{ padding: 20 }}>
        {copingSkills.map((c, i) => <div key={i}>{c.skill}</div>)}
        <Nav />
      </div>
    );
  }

  if (tab === "screen") {
    if (!screen) {
      return (
        <div style={{ padding: 20 }}>
          {Object.keys(screenings).map(k => (
            <button key={k} onClick={() => setScreen(k)}>
              {screenings[k].title}
            </button>
          ))}
          <Nav />
        </div>
      );
    }

    const s = screenings[screen];

    return (
      <div style={{ padding: 20 }}>
        {!score ? (
          <>
            {Array.from({ length: s.items }).map((_, i) => (
              <input key={i} onChange={e => setAnswers({ ...answers, [i]: e.target.value })} />
            ))}
            <button onClick={submit}>Submit</button>
          </>
        ) : (
          <div>
            <p>Score: {score}</p>
            <p>{result}</p>
            <button onClick={exportData}>Export Data</button>
          </div>
        )}
        <Nav />
      </div>
    );
  }

  if (tab === "analytics") {
    const history = JSON.parse(localStorage.getItem("history") || "[]");

    return (
      <div style={{ padding: 20 }}>
        <h2>Analytics</h2>
        <p>Total Sessions: {history.length}</p>
        {history.map((h, i) => (
          <div key={i}>{h.screen} - {h.total} - {h.result}</div>
        ))}
        <Nav />
      </div>
    );
  }

  if (tab === "resources") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Crisis</h2>
        {resources.crisis.map((c, i) => <p key={i}>{c}</p>)}
        <h2>Clinic</h2>
        <p>{resources.clinic}</p>
        <a href="tel:9257326422">Call Clinic</a>
        <Nav />
      </div>
    );
  }

  return null;
}