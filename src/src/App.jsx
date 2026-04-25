import { useEffect, useState, useRef } from "react";

const CONSENT_TEXT = `This platform supports mental health screening, coping skills, and crisis routing. It does not replace emergency care or diagnosis.`;

const copingSkills = [
  "5-4-3--1 Grounding",
  "Box Breathing",
  "Muscle Relaxation",
  "Behavioral Activation",
  "Cold Water Reset",
  "Brain Dump"
];

export default function App() {
  const [consent, setConsent] = useState(false);
  const [tab, setTab] = useState("home");

  if (!consent) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Consent</h2>
        <p>{CONSENT_TEXT}</p>
        <button onClick={() => setConsent(true)}>Agree & Continue</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Wellness App</h1>

      <div>
        <button onClick={() => setTab("home")}>Home</button>
        <button onClick={() => setTab("coping")}>Coping</button>
      </div>

      {tab === "home" && <p>Welcome to the platform</p>}

      {tab === "coping" && (
        <ul>
          {copingSkills.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
