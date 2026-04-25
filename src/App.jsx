import { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function App() {

  // 🔐 CONSENT
  const [consentGiven, setConsentGiven] = useState(false);
  const [roi, setRoi] = useState(false);

  // 👤 LOGIN
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [inputUser, setInputUser] = useState("");

  // 📊 DATA
  const [points, setPoints] = useState(0);
  const [sleepLog, setSleepLog] = useState([]);
  const [moodLog, setMoodLog] = useState([]);
  const [behaviorLog, setBehaviorLog] = useState([]);

  const [tab, setTab] = useState("home");

  // 🚨 SUICIDE FLAG (future use)
  const [suicideFlag, setSuicideFlag] = useState(false);

  // LOAD DATA
  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem(user) || "{}");
      setSleepLog(saved.sleep || []);
      setMoodLog(saved.mood || []);
      setBehaviorLog(saved.behavior || []);
      setPoints(saved.points || 0);
    }
  }, [user]);

  // SAVE DATA
  useEffect(() => {
    if (user) {
      localStorage.setItem(user, JSON.stringify({
        sleep: sleepLog,
        mood: moodLog,
        behavior: behaviorLog,
        points
      }));
    }
  }, [sleepLog, moodLog, behaviorLog, points]);

  // 📊 WELLNESS SCORE
  const getScore = () => {
    let score = 0;

    if (sleepLog.length) {
      const avg = sleepLog.reduce((a,b)=>a+Number(b),0)/sleepLog.length;
      score += avg >= 7 ? 30 : 15;
    }

    score += moodLog.includes("Happy") ? 30 : 10;
    score += behaviorLog.length ? 40 : 10;

    return score;
  };

  // 📄 PDF EXPORT
  const generatePDF = () => {
    if (!roi) {
      alert("ROI required before sending data");
      return;
    }

    const doc = new jsPDF();

    doc.text("Resilient Health Care Report", 10, 10);
    doc.text(`User: ${user}`, 10, 20);
    doc.text(`Score: ${getScore()}`, 10, 30);

    doc.text("Sleep:", 10, 40);
    sleepLog.forEach((s,i)=>doc.text(`${i+1}: ${s} hrs`, 10, 50+i*10));

    doc.save("report.pdf");

    window.location.href =
      "mailto:care@resilient-hc.com?subject=Clinical Report";
  };

  // 🔐 CONSENT SCREEN
  if (!consentGiven) {
    return (
      <div style={styles.center}>
        <h2>Consent & Privacy</h2>

        <label>
          <input type="checkbox" onChange={(e)=>setConsentGiven(e.target.checked)} />
          I consent to data use
        </label>

        <label>
          <input type="checkbox" onChange={(e)=>setRoi(e.target.checked)} />
          I authorize release of info
        </label>

        <button disabled={!consentGiven} onClick={()=>setConsentGiven(true)}>
          Continue
        </button>
      </div>
    );
  }

  // LOGIN
  if (!user) {
    return (
      <div style={styles.center}>
        <h1>Login</h1>
        <input value={inputUser} onChange={(e)=>setInputUser(e.target.value)} />
        <button onClick={()=>{
          setUser(inputUser);
          localStorage.setItem("user", inputUser);
        }}>
          Enter
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <h2>{user} ⭐{points}</h2>

      {/* NAV */}
      <div style={styles.nav}>
        <button onClick={()=>setTab("home")}>Home</button>
        <button onClick={()=>setTab("mood")}>Mood</button>
        <button onClick={()=>setTab("behavior")}>Behavior</button>
        <button onClick={()=>setTab("sleep")}>Sleep</button>
        <button onClick={()=>setTab("games")}>Games</button>
        <button onClick={()=>setTab("provider")}>Provider</button>
      </div>

      {/* HOME */}
      {tab === "home" && (
        <div>
          <h1>Wellness Score</h1>
          <h2>{getScore()} / 100</h2>

          {getScore() < 50 && <p>⚠️ Check in today</p>}
          {getScore() > 70 && <p>🌟 Great job</p>}
        </div>
      )}

      {/* MOOD */}
      {tab === "mood" && (
        <div>
          <h2>Mood</h2>
          {["Happy","Calm","Sad","Stressed"].map(m=>(
            <button key={m} onClick={()=>{
              setMoodLog([...moodLog,m]);
              setPoints(p=>p+3);
            }}>{m}</button>
          ))}
        </div>
      )}

      {/* BEHAVIOR */}
      {tab === "behavior" && (
        <div>
          <h2>Behavior</h2>
          {["Exercise","Social","Focus"].map(b=>(
            <button key={b} onClick={()=>{
              setBehaviorLog([...behaviorLog,b]);
              setPoints(p=>p+4);
            }}>{b}</button>
          ))}
        </div>
      )}

      {/* SLEEP */}
      {tab === "sleep" && (
        <div>
          <h2>Sleep</h2>
          <input type="number" placeholder="hours"
            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                setSleepLog([...sleepLog,e.target.value]);
                setPoints(p=>p+5);
                e.target.value="";
              }
            }}
          />
        </div>
      )}

      {/* GAMES */}
      {tab === "games" && (
        <div>
          <h2>Games</h2>
          <button onClick={()=>setPoints(p=>p+5)}>Breathing +5</button>
          <button onClick={()=>setPoints(p=>p+5)}>Focus +5</button>
        </div>
      )}

      {/* PROVIDER */}
      {tab === "provider" && (
        <div>
          <h2>Provider View</h2>

          <p>Score: {getScore()}</p>

          <button onClick={generatePDF}>
            Export & Email
          </button>

          <button onClick={()=>{
            localStorage.clear();
            window.location.reload();
          }}>
            Logout
          </button>
        </div>
      )}

    </div>
  );
}

const styles = {
  page: { padding:20, background:"#0f172a", color:"white", minHeight:"100vh" },
  center: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh" },
  nav: { display:"flex", gap:5, flexWrap:"wrap", marginBottom:20 }
};
