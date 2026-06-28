import React, { useState, useEffect } from "react";

const EXERCISES = {
  pike: { name:"Pike Push-ups", focus:"Vertical Press", levels:[
    "Incline Pike Push-ups — hands elevated on a bench or sturdy chair",
    "Standard Pike Push-ups — feet and hands on the floor, hips high in an inverted “V” shape",
    "Feet-Elevated Pike Push-ups — feet on a chair/box to shift more weight to the shoulders",
    "Wall-Assisted Handstand Push-up Negatives — lowering down slowly against a wall",
    "Full Wall-Assisted Handstand Push-ups"
  ]},
  pullups: { name:"Pull-ups", focus:"Vertical Pull", levels:[
    "Scapular Pull-ups & Dead Hangs — building grip and shoulder blade strength",
    "Negative Pull-ups — jump or step up to the bar, lower down as slowly as possible",
    "Standard Pull-ups — pronated/overhand grip, dead hang to chin over bar",
    "L-Sit Pull-ups — legs held straight out at a 90° angle while pulling",
    "Chest-to-Bar Pull-ups or Weighted Pull-ups"
  ]},
  pushups: { name:"Standard Push-ups", focus:"Horizontal Press", levels:[
    "Incline Push-ups — hands on a wall, table, or bench",
    "Knee Push-ups — core tight, pivoting from the knees",
    "Standard Push-ups — feet together, body straight as a plank, chest to floor",
    "Diamond Push-ups — hands close together, forming a diamond to target triceps/inner chest",
    "Archer Push-ups or Decline/Pseudo-Planche Push-ups"
  ]},
  rowsOver: { name:"Inverted Rows — Overhand Grip", focus:"Horizontal Pull", levels:[
    "Chest-Height Inverted Rows — body at a steep vertical angle, making it lighter",
    "Waist-Height Bent-Knee Rows — feet flat on the floor, knees bent at 90°",
    "Standard Straight-Leg Inverted Rows — body completely straight, overhand grip",
    "Feet-Elevated Inverted Rows — feet on a box/chair so the body is parallel to the ground",
    "Tuck Front Lever Rows"
  ]},
  dips: { name:"Dips", focus:"Triceps Focus", levels:[
    "Bench Dips — feet on the floor, knees bent",
    "Bench Dips with Straight Legs — feet extended out on the floor or elevated on another bench",
    "Parallel Bar Dips — torso upright, elbows tucked close to the body to keep focus on the triceps",
    "Weighted Parallel Bar Dips or Gymnastic Ring Dips",
    "Straight Bar Dips — dipping on top of a single pull-up bar"
  ]},
  rowsUnder: { name:"Underhand Inverted Rows", focus:"Biceps Focus", levels:[
    "Chest-Height Underhand Rows — steep incline",
    "Waist-Height Underhand Rows with Bent Knees",
    "Standard Straight-Leg Underhand Rows — supinated grip, pulling the bar to lower chest/upper abdomen",
    "Feet-Elevated Underhand Rows",
    "Single-Arm Inverted Rows"
  ]},
  squats: { name:"Squats", focus:"Quad Focus", levels:[
    "Assisted Squats (holding a doorframe/pole) or Box Squats (touching a chair)",
    "Standard Bodyweight Squats — full depth, torso as upright as possible",
    "Close-Stance Squats — feet together to shift more emphasis onto the quads",
    "Bulgarian Split Squats — one foot elevated behind you on a chair",
    "Pistol Squats — full single-leg squat"
  ]},
  lunges: { name:"Lunges", focus:"Single-Leg / Balance", levels:[
    "Split Squats — static lunges where your feet do not move",
    "Alternating Reverse/Forward Lunges — stepping back or forward and returning to center",
    "Deficit Lunges — front foot elevated on a small step to increase range of motion",
    "Walking Lunges",
    "Jumping Lunges — plyometric/explosive power"
  ]},
  gluteBridges: { name:"Glute Bridges", focus:"Hamstring / Glute Focus", levels:[
    "Standard Glute Bridge — both feet flat on the floor",
    "Feet-Elevated Glute Bridge — feet on a chair/couch to increase range of motion",
    "Single-Leg Glute Bridge — one leg extended in the air",
    "Single-Leg Feet-Elevated Glute Bridge",
    "Bodyweight Nordic Curls — lowering torso from kneeling with ankles anchored"
  ]},
  calfRaises: { name:"Calf Raises", focus:"Lower Leg", levels:[
    "Double-Leg Floor Calf Raises",
    "Double-Leg Deficit Calf Raises — standing on the edge of a step, heels drop below toes",
    "Single-Leg Floor Calf Raises",
    "Single-Leg Deficit Calf Raises",
    "Weighted Single-Leg Deficit Calf Raises — holding a dumbbell or wearing a backpack"
  ]},
  legRaises: { name:"Leg Raises", focus:"Core", levels:[
    "Lying Knee Tucks — lying on your back, bending knees to chest",
    "Lying Straight Leg Raises — lying flat, raising legs straight up to 90°",
    "Hanging Knee Raises — hanging from a pull-up bar, lifting knees to chest",
    "Hanging Leg Raises — hanging from a bar, raising straight legs to hip height",
    "Toes-to-Bar or Dragon Flags"
  ]},
  planks: { name:"Planks", focus:"Core", levels:[
    "Incline Plank (hands on a bench) or Knee Plank",
    "Standard Forearm Plank — squeezing glutes, core, and thighs",
    "Side Planks or RKC Plank — actively squeezing elbows and toes toward each other",
    "Extended Plank — hands walked out past your shoulders",
    "Planche Lean"
  ]},
  hollow: { name:"Hollow Body Hold", focus:"Core", levels:[
    "Tuck Hollow Hold — lower back glued to floor, knees bent to chest, hands by your sides",
    "Intermediate Hollow Hold — lower back flat, one leg extended straight, arms by sides",
    "Standard Hollow Body Hold — lower back flat, both legs extended low, arms overhead",
    "Hollow Body Rocks — maintaining the rigid hollow shape while rocking back and forth",
    "V-Sit Hold — hips are the only point touching the ground, V-shape body"
  ]}
};

const DEFAULT_LEVELS = {
  pike:1, pullups:2, pushups:2, rowsOver:2, dips:2, rowsUnder:2,
  squats:1, lunges:1, gluteBridges:1, calfRaises:2, legRaises:1, planks:1, hollow:2
};

const UPPER_WARMUP = [
  "Light Cardio (2 min) — jumping jacks, jump rope, or running in place",
  "Arm Circles — 10 forward, 10 backward, controlled rotations",
  "Wrist Circles — 10 clockwise, 10 counter-clockwise to prep tendons",
  "Torso Twists — 10 total side-to-side to loosen the spine"
];
const UPPER_COOLDOWN = [
  "Doorframe Chest Stretch — forearm on a doorframe, turn away, hold 20–30s",
  "Child's Pose — hips back to heels, arms reaching forward, hold 20–30s",
  "Box Breathing (1 min) — in 4s, hold 4s, out 4s, hold 4s"
];
const LOWER_WARMUP = [
  "Light Cardio (2 min) — jumping jacks, jump rope, or light steps",
  "Easy Squats — 10 reps, slow and shallow to fluidize knees",
  "Leg Swings — 10 forward/backward per leg to stretch hip lines",
  "Wrist Circles — 10 clockwise, 10 counter-clockwise for planks"
];
const LOWER_COOLDOWN = [
  "Forward Fold — bend at the hips, let your head hang heavy, hold 20–30s",
  "Box Breathing (1 min) — in 4s, hold 4s, out 4s, hold 4s"
];

const DAY_TYPES = {
  upper: { label:"Upper Body", cls:"upper-day", warmup:UPPER_WARMUP, cooldown:UPPER_COOLDOWN,
    exerciseIds:["pike","pullups","pushups","rowsOver","dips","rowsUnder"] },
  lowerWed: { label:"Lower Body & Core", cls:"lower-day", warmup:LOWER_WARMUP, cooldown:LOWER_COOLDOWN,
    exerciseIds:["squats","lunges","gluteBridges","calfRaises","legRaises","hollow"] },
  lowerSat: { label:"Lower Body & Core", cls:"lower-day", warmup:LOWER_WARMUP, cooldown:LOWER_COOLDOWN,
    exerciseIds:["squats","lunges","gluteBridges","calfRaises","planks","hollow"] },
  rest: { label:"Rest Day" }
};

const WEEK = [
  { label:"Mon", sub:"Rest",  type:"rest"    },
  { label:"Tue", sub:"Upper", type:"upper"   },
  { label:"Wed", sub:"Lower", type:"lowerWed"},
  { label:"Thu", sub:"Upper", type:"upper"   },
  { label:"Fri", sub:"Rest",  type:"rest"    },
  { label:"Sat", sub:"Lower", type:"lowerSat"},
  { label:"Sun", sub:"Upper", type:"upper"   }
];

const STORAGE_KEY = "progression-levels";

export default function MoirosCalisthenics() {
  const [levels, setLevels] = useState(DEFAULT_LEVELS);
  const [activeDayIndex, setActiveDayIndex] = useState((new Date().getDay() + 6) % 7);
  const [saveNote, setSaveNote] = useState("");
  
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLevels(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveLevels = (newLevels) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLevels));
    setSaveNote("Saved");
    setTimeout(() => setSaveNote(""), 1200);
  };

  const handleStep = (id, direction) => {
    const nextLvl = Math.min(4, Math.max(0, levels[id] + direction));
    const updated = { ...levels, [id]: nextLvl };
    setLevels(updated);
    saveLevels(updated);
  };

  const handleReset = () => {
    setLevels(DEFAULT_LEVELS);
    saveLevels(DEFAULT_LEVELS);
  };

  const askGemini = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    setAiLoading(true);
    setAiResponse("");
    
    const API_KEY = "YOUR_GEMINI_API_KEY"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
      const systemContext = `You are the ultimate Gemini Calisthenics Coach. Answer clearly and concisely. The athlete's current level settings are: ${JSON.stringify(levels)}.`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemContext}\nUser question: ${aiInput}` }] }]
        })
      });

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      setAiResponse(text);
    } catch (err) {
      setAiResponse("Could not reach your AI Coach. Check your network or API Key!");
    } finally {
      setAiLoading(false);
    }
  };

  const day = WEEK[activeDayIndex];
  const cfg = DAY_TYPES[day.type];
  const todayRawIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="app">
      <style>{`
        :root {
          --upper:#2563EB; --upper-bg:#EFF6FF;
          --lower:#0D9488; --lower-bg:#F0FDFA;
          --rest:#6B7280;  --rest-bg:#F3F4F6;
          --ink:#0F172A; --muted:#64748B; --card:#FFFFFF;
          --page:#F8FAFC; --border:#E2E8F0;
        }
        .app { max-width:640px; margin:0 auto; padding:20px 16px 60px; font-family: system-ui, sans-serif; background: var(--page); color: var(--ink); }
        header h1 { font-size:22px; margin:4px 0; }
        header p { color:var(--muted); font-size:14px; margin:0 0 18px; line-height:1.4; }
        .day-strip { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:18px; }
        .day-btn { flex:1 1 auto; min-width:42px; text-align:center; padding:10px 4px; border-radius:10px; border:1px solid var(--border); background:var(--card); font-size:13px; font-weight:600; color:var(--muted); cursor:pointer; position:relative; }
        .day-btn .sub { display:block; font-size:10px; font-weight:500; margin-top:2px; opacity:0.8; }
        .day-btn.today::after { content:""; position:absolute; top:5px; right:6px; width:6px; height:6px; border-radius:50%; background:#F59E0B; }
        .day-btn.active.upper-btn { background:var(--upper); border-color:var(--upper); color:#fff; }
        .day-btn.active.lower-btn { background:var(--lower); border-color:var(--lower); color:#fff; }
        .day-btn.active.rest-btn { background:var(--rest); border-color:var(--rest); color:#fff; }
        .section-title { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--muted); margin:22px 0 8px; }
        .card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:14px 16px; margin-bottom:10px; }
        .card ul { margin:0; padding-left:18px; font-size:14px; line-height:1.55; color:var(--ink); }
        .day-label { display:flex; align-items:center; gap:8px; margin:0 0 4px; }
        .day-label .pill { font-size:11px; font-weight:700; padding:3px 9px; border-radius:999px; color:#fff; }
        .day-label.upper .pill { background:var(--upper); }
        .day-label.lower .pill { background:var(--lower); }
        .day-label h2 { font-size:18px; margin:0; }
        .exercise { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:14px 16px; margin-bottom:10px; }
        .exercise-head { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
        .exercise-head h3 { font-size:15px; margin:0 0 2px; }
        .exercise-head .focus { font-size:12px; color:var(--muted); margin:0; }
        .level-badge { font-size:11px; font-weight:700; padding:3px 9px; border-radius:999px; white-space:nowrap; }
        .upper-day .level-badge { background:var(--upper-bg); color:var(--upper); }
        .lower-day .level-badge { background:var(--lower-bg); color:var(--lower); }
        .level-desc { font-size:13.5px; color:var(--ink); line-height:1.45; margin:10px 0 12px; }
        .stepper { display:flex; align-items:center; justify-content:center; gap:14px; }
        .step-btn { width:34px; height:34px; border-radius:50%; border:1px solid var(--border); background:#fff; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .step-btn:disabled { opacity:0.3; cursor:default; }
        .dots { display:flex; gap:6px; }
        .dot { width:8px; height:8px; border-radius:50%; background:var(--border); }
        .upper-day .dot.filled { background:var(--upper); }
        .lower-day .dot.filled { background:var(--lower); }
        .rest-card { background:var(--rest-bg); border:1px solid var(--border); border-radius:14px; padding:36px 16px; text-align:center; }
        .rest-card .emoji { font-size:32px; display:block; margin-bottom:8px; }
        .rest-card h2 { margin:0 0 6px; font-size:17px; }
        .rest-card p { margin:0; color:var(--muted); font-size:14px; }
        .ai-section { border: 2px dashed #cbd5e1; background: #fff; margin-top: 30px; padding: 16px; border-radius: 14px; }
        .ai-form { display: flex; gap: 8px; margin-top: 10px; }
        .ai-input { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--border); font-size: 14px; }
        .ai-btn { background: #8b5cf6; color: white; border: none; padding: 0 16px; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .ai-box { background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-size: 14px; margin-top: 10px; line-height: 1.5; white-space: pre-line; }
      `}</style>

      <header>
        <h1>Your Workout Program</h1>
        <p>Tap a day to see its warm-up, exercises, and cool-down. Use − / + on any exercise to move between progression levels.</p>
      </header>

      <nav className="day-strip">
        {WEEK.map((d, i) => {
          let btnCls = "day-btn";
          if (i === activeDayIndex) btnCls += ` active ${d.type === 'rest' ? 'rest-btn' : d.type === 'upper' ? 'upper-btn' : 'lower-btn'}`;
          if (i === todayRawIndex) btnCls += " today";
          return (
            <button key={i} className={btnCls} onClick={() => setActiveDayIndex(i)}>
              {d.label}
              <span className="sub">{d.sub}</span>
            </button>
          );
        })}
      </nav>

      <main>
        {day.type === "rest" ? (
          <div className="rest-card">
            <span className="emoji">😌</span>
            <h2>Full Rest Day</h2>
            <p>No warm-up, exercises, or cool-down today — let your body recover.</p>
          </div>
        ) : (
          <div>
            <div className={`day-label ${day.type === 'upper' ? 'upper' : 'lower'}`}>
              <span className="pill">{day.label}</span>
              <h2>{cfg.label}</h2>
            </div>

            <div className="section-title">Warm-Up (5 Minutes)</div>
            <div className="card">
              <ul>{cfg.warmup.map((w, idx) => <li key={idx}>{w}</li>)}</ul>
            </div>

            <div className="section-title">Exercises</div>
            {cfg.exerciseIds.map((id) => {
              const ex = EXERCISES[id];
              const lvl = levels[id];
              return (
                <div key={id} className={`exercise ${cfg.cls}`}>
                  <div className="exercise-head">
                    <div>
                      <h3>{ex.name}</h3>
                      <p className="focus">{ex.focus}</p>
                    </div>
                    <div className="level-badge">Level {lvl + 1} / 5</div>
                  </div>
                  <p className="level-desc">{ex.levels[lvl]}</p>
                  <div className="stepper">
                    <button className="step-btn" disabled={lvl === 0} onClick={() => handleStep(id, -1)}></button>
                    <div className="dots">
                      {[...Array(5)].map((_, dotIdx) => (
                        <span key={dotIdx} className={`dot ${dotIdx <= lvl ? "filled" : ""}`} />
                      ))}
                    </div>
                    <button className="step-btn" disabled={lvl === 4} onClick={() => handleStep(id, 1)}>+</button>
                  </div>
                </div>
              );
            })}

            <div className="section-title">Cool-Down (3–5 Minutes)</div>
            <div className="card">
              <ul>{cfg.cooldown.map((c, idx) => <li key={idx}>{c}</li>)}</ul>
            </div>
          </div>
        )}
      </main>

      <div style={{ textAlign: "center", marginTop: "26px" }}>
        <button style={{ fontSize: "12px", color: "var(--muted)", background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }} onClick={handleReset}>
          Reset all progression levels to defaults
        </button>
        <div style={{ textAlign: "center", fontSize: "11px", color: "var(--muted)", marginTop: "6px", minHeight: "14px" }}>{saveNote}</div>
      </div>

      <section className="ai-section">
        <h3 style={{ margin: "0 0 4px", fontSize: "15px" }}>💬 Ask Your Gemini Coach</h3>
        <p style={{ margin: "0 0 10px", fontSize: "12px", color: "var(--muted)" }}>Ask form tips, nutrition hacks, or how to break plateaus.</p>
        <form className="ai-form" onSubmit={askGemini}>
          <input className="ai-input" type="text" placeholder="e.g., how can I lock down the pistol squat balance?" value={aiInput} onChange={(e) => setAiInput(e.target.value)} />
          <button className="ai-btn" type="submit" disabled={aiLoading}>{aiLoading ? "..." : "Ask"}</button>
        </form>
        {aiResponse && <div className="ai-box">{aiResponse}</div>}
      </section>
    </div>
  );
}
