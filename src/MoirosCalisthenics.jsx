import { useState, useEffect, useRef } from "react";

const SEC = {
  WARMUP:   { label:"🔥 Warm Up",         col:"#fb923c", bg:"rgba(251,146,60,.12)",   bd:"rgba(251,146,60,.35)"   },
  SKILLS:   { label:"⭐ Skills Work",      col:"#c084fc", bg:"rgba(192,132,252,.12)",  bd:"rgba(192,132,252,.35)"  },
  VOLUME:   { label:"💪 Volume Training",  col:"#60a5fa", bg:"rgba(96,165,250,.12)",   bd:"rgba(96,165,250,.35)"   },
  ACCESS:   { label:"🔧 Accessories",      col:"#34d399", bg:"rgba(52,211,153,.12)",   bd:"rgba(52,211,153,.35)"   },
  COOLDOWN: { label:"❄️ Cool Down",        col:"#94a3b8", bg:"rgba(148,163,184,.12)",  bd:"rgba(148,163,184,.35)"  },
};
const SEC_ORDER = ["WARMUP","SKILLS","VOLUME","ACCESS","COOLDOWN"];

const PLAN = {
  0: {
    name:"Rest Day", day:"Sunday", icon:"🌙", col:"#64748b", grad:["#1e293b","#0f172a"], exercises:[],
    tip:"Rest is when adaptation happens. Sleep 8+ hours, eat 1.6–2g protein per kg bodyweight, let your CNS fully reset."
  },
  1: {
    name:"Pull A", day:"Monday", icon:"💪", col:"#818cf8", grad:["#4338ca","#6d28d9"],
    tip:"Front lever day. The pulling skill with the highest payoff — strong lats, a bulletproof core, and serious upper-body control.",
    exercises:[
      {id:"m_w1",sec:"WARMUP",name:"Dead Hang",sets:2,rest:30,muscle:"Grip · Shoulder Decompression",
       rirNote:"Passive decompression only — pushing toward fatigue here defeats the purpose and pre-fatigues the grip you need later.",
       curLv:0,levels:[
         {n:"Dead Hang 20s",pose:"hang",d:"Hang fully relaxed, let gravity decompress the spine",reps:"20 sec",rir:"RIR 4+",
          cues:["Hang completely relaxed — let gravity work","Breathe slow and deep throughout","Warms up wrist flexors and decompresses the spine","This is passive — focus only on breathing"]},
         {n:"Dead Hang 45s",pose:"hang",d:"Same relaxed hang, doubled duration",reps:"45 sec",rir:"RIR 4+",
          cues:["Same fully passive hang, just extended","Breathing stays slow even as grip starts to fatigue","If grip gives out before 45s, that's today's ceiling — no problem","Shake hands out between attempts"]},
         {n:"L-Hang",pose:"l-hang",d:"Hang with straight legs raised to 90°",reps:"15–20 sec",rir:"RIR 4+",
          cues:["Hang first, then lift straight legs to hip height","Lower back rounds slightly — this is hollow body in the air","Shoulders stay pulled down, away from the ears","Control the legs down — don't just let them drop"]},
         {n:"Single-Arm Hang",pose:"single-arm-hang",d:"Bodyweight supported on one arm at a time",reps:"5–10 sec each arm",rir:"RIR 4+",
          cues:["Only attempt once two-arm dead hangs feel effortless","Actively engage the working shoulder — never hang passively on one side","Keep hips square, resist rotating toward the working arm","Switch arms evenly and track time on each side separately"]}
       ]},
      {id:"m_w2",sec:"WARMUP",name:"Scapular Pull-ups",sets:2,rest:30,muscle:"Lower Traps · Serratus",
       rirNote:"Pure activation drill — fatigue here blunts the pulling work that follows.",
       curLv:0,levels:[
         {n:"Depression Only",pose:"scap-hang",d:"Just pull the shoulders straight down, skip retraction",reps:"10 reps",rir:"RIR 4+",
          cues:["Hang with arms straight, shoulders relaxed up by the ears","Pull shoulder blades straight DOWN — body barely moves","Hold the depressed position briefly, then release","This isolates the lower traps before adding retraction"]},
         {n:"Scapular Pull-ups",pose:"scap-hang",d:"Depress and retract the shoulder blades together",reps:"10 reps",rir:"RIR 4+",
          cues:["Arms COMPLETELY straight — no bending ever","Move only by pulling shoulder blades DOWN and TOGETHER","Body rises just 2–3 cm — that is correct","Slowly let shoulders elevate back to start","Feel it directly under your armpits"]},
         {n:"With 2s Pause",pose:"scap-hang",d:"Hold the fully depressed position for 2 seconds each rep",reps:"8 reps",rir:"RIR 4+",
          cues:["Same depression-and-retraction movement as before","At the bottom of each rep, hold for a strict 2 count","Don't let the hold turn into a shrug — keep the chest tall","This builds the isometric strength your pull-up lockout needs"]}
       ]},
      {id:"m_w3",sec:"WARMUP",name:"Arm Circles + Wrist Rolls",sets:1,rest:0,muscle:"Shoulder Mobility · Wrist Prep",
       rirNote:"Mobility prep only — never loaded or pushed for reps.",
       curLv:0,levels:[
         {n:"Bodyweight mobility",pose:"circle-arms",d:"Large arm circles plus full wrist rotations",reps:"30 sec each direction",rir:"RIR 4+",
          cues:["Large controlled circles: 10 forward, 10 backward","Wrist circles: full range clockwise then counter-clockwise","This is gentle prep — not working sets","Finish with finger interlace and wrist stretch"]}
       ]},
      {id:"m_s1",sec:"SKILLS",name:"Front Lever Hold",sets:4,rest:90,muscle:"Lats · Core · Shoulders · Full Posterior Chain",
       rirNote:"One of the highest-risk static holds for the shoulders and lower back — leave real reserve and never let the hips sag to compensate.",
       curLv:0,levels:[
         {n:"Tuck Front Lever Hold",pose:"front-lever-tuck",d:"Knees tucked tight to the chest, hanging horizontal",reps:"8–12 sec",rir:"2s Reserve",
          cues:["Hang from the bar, then pull knees tight to the chest","Rotate the hips so the lower back is flat, not arched","Push the bar away slightly — active shoulders, not a dead hang","Shortest lever in the family — the safest place to start"]},
         {n:"Advanced Tuck Front Lever",pose:"front-lever-adv-tuck",d:"Hips open slightly, knees still tucked but further from the chest",reps:"6–10 sec",rir:"2s Reserve",
          cues:["Open the hip angle slightly compared to the basic tuck","Knees stay bent but drift further away from the chest","This is where most of the real strength carryover begins","If the hips drop, tuck back in tighter and rebuild from there"]},
         {n:"Single-Leg Front Lever",pose:"front-lever-single",d:"One leg extended straight, the other still tucked",reps:"4–8 sec",rir:"2–3s Reserve",
          cues:["Extend one leg fully straight while the other stays tucked","The straight leg adds real lever length — expect a big jump in difficulty","Alternate which leg extends between sets to build evenly","Keep the hips square, don't let them twist toward the bent knee"]},
         {n:"Straddle Front Lever",pose:"front-lever-straddle",d:"Both legs straight and spread wide, shortening the lever",reps:"3–6 sec",rir:"3s Reserve",
          cues:["Both legs straight, spread wide to shorten the effective lever","Wider straddle is easier — narrow it gradually over months","Hips and shoulders must stay level — no sagging at the hips","This is the bridge between tuck work and a true full lever"]},
         {n:"Full Front Lever",pose:"front-lever",d:"Legs together and straight — the complete skill",reps:"2–5 sec",rir:"3–4s Reserve",
          cues:["The longest possible lever — legs together, fully straight","Demands years of progressive tuck and straddle work first","Active shoulders the whole time — push the bar away, don't just hang","A 2-second hold here is already a serious achievement"]}
       ]},
      {id:"m_s2",sec:"SKILLS",name:"Front Lever Negatives",sets:3,rest:90,muscle:"Lats · Core · Shoulders",
       rirNote:"Stop the descent the exact moment the hips start dropping or the lower back rounds.",
       curLv:0,levels:[
         {n:"Tuck Negative (3s)",pose:"front-lever-tuck",d:"Pull to a tuck front lever, lower over 3 seconds",reps:"3 reps",rir:"RIR 1",
          cues:["Pull your knees to your chest into a tuck front lever at the top","Lower over a controlled 3-second count back to a hang","Reset to a full dead hang before the next rep","This teaches the eccentric strength that holds depend on"]},
         {n:"Tuck Negative (5s)",pose:"front-lever-tuck",d:"Same tuck negative, stretched to a 5-second descent",reps:"3–4 reps",rir:"RIR 1",
          cues:["Same tuck front lever start, now a full 5-second lower","The last third of the descent is where most people speed up","Breathe out slowly and evenly through the whole movement","Once 5 seconds feels smooth, you're ready for a harder shape"]},
         {n:"Straddle Negative",pose:"front-lever-straddle",d:"Pull to a straddle front lever, lower under control",reps:"3–4 reps",rir:"RIR 1–2",
          cues:["Pull to a wide straddle front lever at the top of the rep","Lower over 4–5 seconds, keeping the hips level the whole way","A noticeably bigger strength demand than the tuck version","Narrow the straddle slightly once this feels consistently smooth"]},
         {n:"Full Lever Negative",pose:"front-lever",d:"Pull to a full front lever, lower as slowly as possible",reps:"2–3 reps",rir:"RIR 2",
          cues:["Pull to the longest, full-extension lever position at the top","Lower as slowly as you can control — even 2 seconds counts here","This is genuinely elite-level eccentric strength work","Stop immediately if the lower back starts to round under fatigue"]}
       ]},
      {id:"m_v1",sec:"VOLUME",name:"Tuck Front Lever Hold",sets:3,rest:60,muscle:"Lats · Core",
       rirNote:"The easier, higher-volume regression that builds the base under your SKILLS-tier lever work.",
       curLv:0,levels:[
         {n:"Dead Bug Hang",pose:"dead-bug-hang",d:"Hang with knees bent close to the chest, very short lever",reps:"10–15 sec",rir:"RIR 1",
          cues:["Hang from the bar, knees pulled close to the chest","This is shorter and easier than a true tuck front lever","Use it purely to build time and confidence in the inverted-hip position","Keep the lower back flat — don't let it sag toward the floor"]},
         {n:"Tuck Front Lever Hold",pose:"front-lever-tuck",d:"Standard tuck hold, performed for longer total volume",reps:"15–20 sec",rir:"RIR 1–2",
          cues:["Same tuck shape as your SKILLS work, just for more total time","Spread the time across the set however you need — breaks are fine","This is about accumulating tuck-position strength, not a max test","Active shoulders throughout — push the bar away"]},
         {n:"Advanced Tuck Hold",pose:"front-lever-adv-tuck",d:"Hips slightly more open, longer total accumulated time",reps:"12–18 sec",rir:"RIR 2",
          cues:["A slightly more open hip angle than the basic tuck","Still aimed at volume — multiple shorter holds add up fine","If the basic tuck feels easy for 20+ seconds, this is the next step","Keep breathing — don't hold your breath through the hold"]},
         {n:"Single-Leg Tuck Hold",pose:"front-lever-single",d:"One leg extended, building toward the straddle and full lever",reps:"8–12 sec",rir:"RIR 2",
          cues:["Extend one leg while the other stays tucked, for volume not a max hold","Alternate sides between sets to build both evenly","A natural stepping stone once advanced tuck holds feel easy","This is genuinely advanced — be patient with the time targets"]}
       ]},
      {id:"m_v2",sec:"VOLUME",name:"Front Lever Raises",sets:3,rest:75,muscle:"Lats · Core · Hip Flexors",
       rirNote:"Dynamic reps are an easier, more forgiving way to build lever strength than chasing a longer max hold.",
       curLv:0,levels:[
         {n:"Hanging Knee Tuck Pulls",pose:"front-lever-tuck",d:"From a hang, pull the knees up and slightly back, then lower",reps:"8–10 reps",rir:"RIR 1",
          cues:["Start from a dead hang, pull the knees up and slightly behind you","This rehearses the tuck front lever shape dynamically","Lower with control — don't just let the legs swing back down","The easiest entry point into lever-specific raises"]},
         {n:"Tuck Front Lever Raises",pose:"front-lever-tuck",d:"Pull into a tuck front lever, then lower and repeat",reps:"6–8 reps",rir:"RIR 1–2",
          cues:["Pull from a hang into a full tuck front lever position","Lower under control rather than dropping back to a hang","Each rep should look identical — no rushing the last few","This builds the exact strength your tuck hold depends on"]},
         {n:"Advanced Tuck Raises",pose:"front-lever-adv-tuck",d:"Same raise, hips more open at the top",reps:"5–8 reps",rir:"RIR 2",
          cues:["Same pulling pattern, but open the hip angle at the top","Noticeably harder than the basic tuck raise","Quality over quantity — a clean 5 beats a sloppy 8","Pause briefly at the top of each rep to confirm the shape"]},
         {n:"Straddle Raises",pose:"front-lever-straddle",d:"Pull into a straddle front lever, then lower and repeat",reps:"4–6 reps",rir:"RIR 2",
          cues:["Legs straight and spread wide at the top of each pull","A serious step up in difficulty from any tuck variation","Keep the straddle wide enough to maintain clean form","Narrow the straddle gradually as these get easier over months"]}
       ]},
      {id:"m_a1",sec:"ACCESS",name:"Pull-ups",sets:3,rest:120,muscle:"Lats · Biceps · Core",
       rirNote:"Basic pulling strength — the foundation everything else in this program builds on.",
       curLv:4,levels:[
         {n:"Dead Hang",pose:"hang",d:"Foundation hang — build time and grip before pulling",reps:"30–45 sec",rir:"RIR 1",
          cues:["Hang from the bar with arms fully straight","Keep shoulders active — pulled down, not shrugged to your ears","Build toward 30–45 seconds before progressing","This is the floor every pull-up is built from"]},
         {n:"Scapular Pull-ups",pose:"scap-hang",d:"Add the shoulder-blade pull before adding elbow bend",reps:"10–15 reps",rir:"RIR 1",
          cues:["Arms stay straight — only the shoulder blades move","Pull down and together, then control back up","10–15 clean reps here before chasing a bent-arm pull","This teaches the first millimetre of every pull-up"]},
         {n:"Band Assisted",pose:"band-assisted-pullup",d:"Loop a band under your foot or knee to offload bodyweight",reps:"8–10 reps",rir:"RIR 1–2",
          cues:["Choose a band that lets you complete full clean reps","Start from a true dead hang every rep — no shortcuts","Chin clears the bar, then a controlled lower","Move to a thinner band only once reps feel easy"]},
         {n:"Negatives",pose:"pullup-negative",d:"Jump to the top, lower under control",reps:"4–5 reps",rir:"RIR 1",
          cues:["Jump or step up to chin-over-bar position","Lower over 4–5 seconds — fight gravity the whole way","Reset to a full dead hang at the bottom","This builds the exact strength curve a real pull-up needs"]},
         {n:"Pull-ups 2–3",pose:"pullup",d:"Strict reps from a dead hang",reps:"2–3 reps",rir:"RIR 1",
          cues:["Start from a DEAD hang — full arm extension, zero tension","Initiate by pulling shoulder blades DOWN then BACK","Drive elbows toward hips — imagine bending the bar","Chin must CLEAR the bar — not just reach it","Lower with CONTROL — never drop"]},
         {n:"Pull-ups ×5",pose:"pullup",d:"Same strict standard, now for five consecutive reps",reps:"5 reps",rir:"RIR 1–2",
          cues:["Same dead-hang start and full chin clearance as before","Reps 4–5 are where form usually leaks — watch the kip","If hips start swinging, that's your true rep count for today","Quality across all 5 beats grinding out a sloppy 6th"]},
         {n:"Pull-ups ×10",pose:"pullup",d:"Ten strict reps — true upper-body endurance territory",reps:"10 reps",rir:"RIR 2",
          cues:["Pace yourself — don't sprint the first 3 reps","Breathe out on the pull, in on the controlled lower","Expect a slight slow-down around rep 7–8, that's normal","Stop the set the instant the dead-hang reset disappears"]},
         {n:"L-Sit Pull-ups",pose:"lsit-pullup",d:"Pull-ups with legs held horizontal throughout",reps:"3–5 reps",rir:"RIR 2",
          cues:["Lock the L-sit BEFORE you start pulling, not during","Hips stay high the entire rep — no dropping legs to cheat","This is a massive core-and-lat combined demand","Expect far fewer reps than your normal pull-up max"]},
         {n:"Weighted Pull-ups",pose:"weighted-pullup",d:"Add load via a dip belt or weighted vest (age 16+)",reps:"3–5 reps",rir:"RIR 2–3",
          cues:["Not recommended until age 16 — growth plates first","Start with the lightest available increment","Same dead-hang standard applies — weight doesn't excuse form","Reduce reps, never reduce range of motion"]},
         {n:"Archer Pull-ups",pose:"archer-pullup",d:"Shift bodyweight toward one arm while the other stays extended",reps:"3–5 reps each side",rir:"RIR 2–3",
          cues:["Pull your body toward the bent arm, not straight up the middle","The straight arm stays long — it assists, it doesn't pull","Keep the pull slow enough to control the lateral shift","Switch sides every set to build evenly"]},
         {n:"One-Arm Pull-up",pose:"archer-pullup",d:"The elite endpoint — full bodyweight on a single arm",reps:"1 rep (assisted)",rir:"RIR 3",
          cues:["Years of archer and weighted work should precede this attempt","Use a towel or band assist for early attempts, never ego","The free arm can lightly touch the body for balance, not pull","Most people never need this — archer pull-ups build the same strength safely"]}
       ]},
      {id:"m_a2",sec:"ACCESS",name:"Chin-ups",sets:2,rest:90,muscle:"Biceps · Lower Lats",
       rirNote:"Supinated grip allows slightly more volume — basic accessory work to round out your pulling.",
       curLv:1,levels:[
         {n:"Band Chin-ups",pose:"band-assisted-pullup",d:"Same band assistance as pull-ups, palms facing you",reps:"8–10 reps",rir:"RIR 1",
          cues:["Same band setup as your assisted pull-ups","Palms face YOU this time — supinated grip","Notice the extra bicep involvement immediately","Use this to build chin-up volume before going unassisted"]},
         {n:"Chin-ups",pose:"pullup",d:"Strict supinated-grip pull-up",reps:"Max reps",rir:"RIR 1",
          cues:["Palms facing YOU — supinated grip","Biceps more involved → usually 1–2 extra reps","Still start from a dead hang — no cheating","Track and compare against pull-up reps"]},
         {n:"Weighted Chin-ups",pose:"weighted-pullup",d:"Add 2.5–5kg load (age 16+ recommended)",reps:"3–5 reps",rir:"RIR 2",
          cues:["Hold off until age 16 — let tendons mature first","Start with the smallest weight increment available","Keep the same dead-hang start and full chin clearance","If reps drop below 3 with weight, go back down a size"]}
       ]},
      {id:"m_c1",sec:"COOLDOWN",name:"Lat + Teres Major Stretch",sets:1,rest:15,muscle:"Latissimus Dorsi",
       rirNote:"Stretching is never forced — ease in and breathe, don't chase a deeper range than today allows.",
       curLv:0,levels:[
         {n:"Doorframe Stretch",pose:"stretch-standing",d:"Standing stretch using a doorframe or pole",reps:"45 sec each side",rir:"RIR 4+",
          cues:["Grab a pole or doorframe overhead at arm's length","Let your body lean away and slightly rotate","Breathe deeply INTO the stretch — feel the lat release","Hold steady — never force or bounce"]},
         {n:"Bar Hang Stretch",pose:"hang",d:"Full passive hang and lean from a pull-up bar",reps:"30 sec each side",rir:"RIR 4+",
          cues:["Hang from the bar, then walk your feet to one side","Let the lat lengthen under light bodyweight load","Keep breathing slow — this is deeper than the doorframe version","Only use this once the doorframe version feels too gentle"]}
       ]},
      {id:"m_c2",sec:"COOLDOWN",name:"Bicep + Forearm Flexor Stretch",sets:1,rest:15,muscle:"Biceps · Forearm Flexors",
       rirNote:"Tendons stretch slowly — ease in rather than forcing range.",
       curLv:0,levels:[
         {n:"Manual Forearm Stretch",pose:"stretch-arm",d:"Hand-assisted stretch, arm extended",reps:"30 sec each arm",rir:"RIR 4+",
          cues:["Extend arm fully, turn palm up","Gently pull fingers BACK with other hand","Feel stretch from fingers through forearm to elbow","Hold steady — tendons stretch slowly"]},
         {n:"Wall-Assisted Stretch",pose:"stretch-arm",d:"Palm pressed flat against a wall for deeper range",reps:"30 sec each arm",rir:"RIR 4+",
          cues:["Press palm flat against a wall, fingers pointing down","Lean body weight gently away from the wall","This reaches a deeper angle than the manual version","Ease in slowly — never bounce into the stretch"]}
       ]},
      {id:"m_c3",sec:"COOLDOWN",name:"Shoulder Cross-Body + Neck Release",sets:1,rest:0,muscle:"Posterior Delt · Rotator Cuff · Neck",
       rirNote:"Closing sequence — gentle and unhurried.",
       curLv:0,levels:[
         {n:"Cross-body + neck release",pose:"neck-tilt",d:"Combined shoulder and neck release to close the session",reps:"30 sec each + 1 min",rir:"RIR 4+",
          cues:["Cross-body: pull arm across chest, other hand at elbow","Look opposite direction to deepen the stretch","Neck: slowly tilt ear to shoulder, hold 15s each side","End with 10 deep breaths — let the session settle"]}
       ]},
    ]
  },
  2: {
    name:"Push A", day:"Tuesday", icon:"🔥", col:"#f87171", grad:["#dc2626","#c2410c"],
    tip:"Planche day. The ultimate test of straight-arm pushing strength — patience with the lean and tuck work pays off for years.",
    exercises:[
      {id:"t_w1",sec:"WARMUP",name:"Scapular Push-ups",sets:2,rest:30,muscle:"Serratus Anterior · Scapular Control",
       rirNote:"Pure activation drill — save real effort for the pressing work ahead.",
       curLv:0,levels:[
         {n:"Scapular Push-ups",pose:"scap-pushup",d:"Plank position, protract and retract the shoulder blades",reps:"10 reps",rir:"RIR 4+",
          cues:["In plank position — arms STRAIGHT, body rigid","PROTRACT: spread shoulder blades apart (push floor away)","RETRACT: let shoulder blades squeeze together","Body stays absolutely rigid — no hip movement","This pre-activates serratus anterior — essential for pushing"]},
         {n:"On Parallettes",pose:"scap-pushup",d:"Same movement with hands raised on parallettes",reps:"10 reps",rir:"RIR 4+",
          cues:["Parallettes let the shoulder blades travel a greater range","Grip handles firmly, keep wrists neutral, not bent back","Same rigid plank — hips don't dip or pike","The extra range makes the protraction phase noticeably harder"]},
         {n:"Ring Scapular Push-ups",pose:"scap-pushup",d:"Performed on gymnastic rings for maximum instability",reps:"8 reps",rir:"RIR 4+",
          cues:["Rings add a stabilization challenge on top of the range increase","Keep the rings turned out slightly to protect the shoulders","Move slower than on parallettes — control beats speed here","Only attempt once the parallette version feels completely stable"]}
       ]},
      {id:"t_w2",sec:"WARMUP",name:"Shoulder Circles + Thoracic Rotation",sets:1,rest:0,muscle:"Shoulder Capsule · Upper Back",
       rirNote:"Mobility only — never loaded.",
       curLv:0,levels:[
         {n:"Bodyweight circles",pose:"circle-arms",d:"Arm circles plus thread-the-needle thoracic rotation",reps:"30 sec each",rir:"RIR 4+",
          cues:["Large arm circles: 10 forward, 10 backward","Thread-the-needle: 4-point position, rotate arm under body and sweep up","Opens thoracic spine for clean pushing mechanics","Move slowly and deliberately"]}
       ]},
      {id:"t_w3",sec:"WARMUP",name:"Band Pull-Aparts",sets:2,rest:20,muscle:"Rear Delts · External Rotators",
       rirNote:"Activation, not a burnout set — keep reps crisp and easy.",
       curLv:0,levels:[
         {n:"Pull-Aparts",pose:"band-pull",d:"Band held at shoulder height, pulled apart",reps:"15 reps",rir:"RIR 4+",
          cues:["Hold band at shoulder height, arms straight","Pull apart until band touches chest","Squeeze shoulder blades hard at the end","Pre-activates antagonists — critical for shoulder health on push days"]},
         {n:"Face Pulls",pose:"band-pull",d:"Band pulled toward the face with high elbows",reps:"12 reps",rir:"RIR 4+",
          cues:["Anchor the band roughly at face height","Pull toward your face leading with the elbows, not the hands","Elbows finish higher than your wrists","This hits the rear delts and rotator cuff harder than a flat pull-apart"]}
       ]},
      {id:"t_s1",sec:"SKILLS",name:"Planche Hold",sets:5,rest:75,muscle:"Shoulders · Wrists · Core · Chest",
       rirNote:"Planche loads the wrists and shoulders hard — stop well before any shake or wrist pain, not just before failure.",
       curLv:0,levels:[
         {n:"Planche Lean",pose:"planche-lean",d:"Push-up position, shoulders leaning forward of the hands",reps:"8–12 sec",rir:"2s Reserve",
          cues:["Straight-arm push-up position, lean shoulders forward of the hands","Push the floor away hard — protraction is everything here","This teaches the forward weight shift every planche depends on","Keep the body in one straight line, no hips sagging"]},
         {n:"Tuck Planche Lean",pose:"tuck-planche-lean",d:"Hips lifted and tucked, leaning further forward",reps:"6–10 sec",rir:"2s Reserve",
          cues:["Knees pulled tight to the chest, hips lifted off the ground","Lean the shoulders well forward of the hands","Breathe in short controlled sips — this compresses the core hard","Never let the chest sink toward the floor"]},
         {n:"Tuck Planche",pose:"tuck-planche",d:"Full tuck hold, both feet off the floor",reps:"4–8 sec",rir:"2–3s Reserve",
          cues:["Both feet lift completely clear of the floor","Round the upper back and push away forcefully","Hips stay level with or above the shoulders","The first true planche hold — a genuine milestone"]},
         {n:"Advanced Tuck Planche",pose:"planche-adv-tuck",d:"Hips open slightly, knees still bent but further from the chest",reps:"3–6 sec",rir:"3s Reserve",
          cues:["Open the hip angle beyond the basic tuck, knees still bent","A significant jump in shoulder and core demand","If the hips drop, tuck back in tighter and rebuild patiently","This is where straddle planche becomes realistic"]},
         {n:"Straddle Planche",pose:"planche-straddle",d:"Legs wide and straight, hips level with shoulders",reps:"2–5 sec",rir:"3s Reserve",
          cues:["Legs spread wide and straight to shorten the lever","Wider straddle is easier — narrow it gradually over months","Hips and shoulders form one level line","Years of tuck planche work earn this position"]},
         {n:"Full Planche",pose:"planche",d:"Legs together and straight — the complete skill",reps:"1–4 sec",rir:"3–4s Reserve",
          cues:["The longest possible lever — legs together, fully extended","Requires years of progressive straddle and tuck work","Push relentlessly through the floor, shoulders stay protracted","Most athletes never need this — straddle already proves the strength"]}
       ]},
      {id:"t_s2",sec:"SKILLS",name:"Planche Push-ups",sets:3,rest:90,muscle:"Shoulders · Chest · Triceps · Core",
       rirNote:"A genuinely advanced pressing drill — stop the instant the shoulders dip or the lean collapses.",
       curLv:0,levels:[
         {n:"Planche Lean Push-ups",pose:"planche-lean",d:"Small range push-up performed from the planche lean position",reps:"4–6 reps",rir:"RIR 1–2",
          cues:["Set up in a planche lean — shoulders forward of the hands","Bend the elbows slightly and press back to the lean position","Small range of motion is fine — this is about the forward lean under load","Reset the lean each rep, don't let it drift back to neutral"]},
         {n:"Tuck Planche Push-ups",pose:"tuck-planche",d:"Push-ups performed in the tuck planche position",reps:"3–5 reps",rir:"RIR 2",
          cues:["Hold a tuck planche, then bend the elbows and press back up","Feet stay off the floor for the entire set, every rep","This is a serious step up in shoulder and tricep demand","Quality reps only — three clean ones beat five sloppy ones"]},
         {n:"Advanced Tuck Push-ups",pose:"planche-adv-tuck",d:"Same movement from a more open tuck position",reps:"2–4 reps",rir:"RIR 2",
          cues:["Same pressing pattern, performed from the more open tuck shape","Expect very short ranges of motion at this level — that's normal","Stop the set the moment the hips drop or the lean collapses","An elite-tier pressing drill — patience pays off here"]}
       ]},
      {id:"t_v1",sec:"VOLUME",name:"Tuck Planche Hold",sets:3,rest:60,muscle:"Shoulders · Core · Wrists",
       rirNote:"Easier, higher-volume regression that builds the base under your SKILLS-tier planche work.",
       curLv:0,levels:[
         {n:"Frog Stand",pose:"frog-stand",d:"Knees resting on the elbows, balancing on the hands",reps:"10–15 sec",rir:"RIR 1",
          cues:["Squat down, place hands flat, rest knees on the backs of the upper arms","Lean forward slowly until the feet lift naturally off the floor","This is the gentlest entry point into planche-style balancing","Look slightly forward, not straight down, to help balance"]},
         {n:"Tuck Planche Hold",pose:"tuck-planche",d:"Standard tuck hold, performed for longer total volume",reps:"12–18 sec",rir:"RIR 1–2",
          cues:["Same tuck shape as your SKILLS work, just for more total time","Push the floor away hard throughout, never just resting on the hands","Short broken-up holds across the set are completely fine","This builds the shoulder endurance your max holds depend on"]},
         {n:"Advanced Tuck Hold",pose:"planche-adv-tuck",d:"Hips slightly more open, longer total accumulated time",reps:"8–14 sec",rir:"RIR 2",
          cues:["A slightly more open hip angle than the basic tuck","Use this once basic tuck holds feel easy for 18+ seconds","Quality over a long clock time — reset if the shape breaks down","Wrist strength builds slowly here — be patient with it"]}
       ]},
      {id:"t_v2",sec:"VOLUME",name:"Planche Lean",sets:3,rest:45,muscle:"Shoulders · Chest · Wrists",
       rirNote:"The single most foundational planche-strength builder — high volume here pays off for years.",
       curLv:1,levels:[
         {n:"Wall-Assisted Lean",pose:"wall-planche-lean",d:"Feet against a wall for support while leaning forward",reps:"15–20 sec",rir:"RIR 1",
          cues:["Push-up position with feet lightly resting against a wall","Lean shoulders forward of the hands, using the wall for confidence","This removes the falling-forward fear while you learn the lean","Push the floor away hard — don't just rest on straight arms"]},
         {n:"Planche Lean",pose:"planche-lean",d:"Unassisted lean, shoulders forward of the hands",reps:"10–15 sec",rir:"RIR 1–2",
          cues:["Straight-arm push-up position, lean shoulders forward of hands","The lean teaches the forward weight shift every planche depends on","Keep the body in one straight line, no hip sag","Build toward 15+ seconds before adding a tuck"]},
         {n:"Deep Planche Lean",pose:"tuck-planche-lean",d:"A more aggressive forward lean, closer to a tuck planche angle",reps:"6–10 sec",rir:"RIR 2",
          cues:["Lean further forward than the standard lean — shoulders well past the hands","Wrists take real load here — stop at any sign of wrist pain","A direct bridge into tuck planche work","Build this gradually over many weeks, not days"]}
       ]},
      {id:"t_a1",sec:"ACCESS",name:"Push-ups",sets:3,rest:75,muscle:"Chest · Anterior Deltoid · Triceps",
       rirNote:"Basic pressing strength — the foundation under your planche work above.",
       curLv:2,levels:[
         {n:"Incline Push-ups",pose:"incline-pushup",d:"Hands elevated on a chair or bench — easiest angle",reps:"12–15 reps",rir:"RIR 1",
          cues:["Hands on a chair or bench, body angled upward","Same straight-body plank as a floor push-up","Use this to build volume before lowering the hand height","Full range — chest to hands, full lockout at top"]},
         {n:"Standard Push-ups",pose:"pushup",d:"Hands and feet on the floor — the baseline",reps:"15–20 reps",rir:"RIR 1",
          cues:["Hands roughly shoulder-width, body in a straight plank","Lower until chest nearly touches the floor","Push back up to a full elbow lockout","Core tight throughout — no sagging or piking"]},
         {n:"Decline Push-ups",pose:"pushup-decline",d:"Feet elevated — increases shoulder and upper-chest load",reps:"10–12 reps",rir:"RIR 1–2",
          cues:["Feet elevated on chair or bench","Core TIGHT — hips can't sag or pike","Full range: chest nearly touches the floor","Complete lockout at the top — squeeze triceps","Higher elevation = more shoulder activation"]},
         {n:"Archer Push-ups",pose:"archer-pushup",d:"Shift weight toward one arm while the other stays extended",reps:"6–8 reps each side",rir:"RIR 2",
          cues:["Lower toward one hand while the other arm stays long and straight","The straight arm assists balance, it doesn't drive the rep","Push back to center, not just up","Track reps per side separately — they often differ"]},
         {n:"Pseudo Planche PU",pose:"planche-lean",d:"Hands shifted back toward the hips, shoulders forward",reps:"5–8 reps",rir:"RIR 2",
          cues:["Hands positioned further back, near the hip line","Lean shoulders forward of the hands throughout the rep","This dramatically increases shoulder and tricep demand","Keep the body rigid — this is a planche-strength builder in disguise"]},
         {n:"OA Negatives",pose:"archer-pushup",d:"One-arm push-up lowering phase only",reps:"3–4 reps each arm",rir:"RIR 2",
          cues:["Start at the top in a one-arm plank position","Lower as slowly as control allows, fighting the whole way down","The free hand can rest lightly on the back, not push off the floor","Reset from the floor each rep — don't try to press back up yet"]},
         {n:"One-Arm Push-up",pose:"archer-pushup",d:"Full push-up on a single arm — elite end goal",reps:"1–3 reps each arm",rir:"RIR 2–3",
          cues:["Feet set slightly wider for a stable base","Keep hips from rotating open — stay square to the floor","Push through the whole hand, not just the fingers","Years of pseudo planche and OA negative work earn this rep"]}
       ]},
      {id:"t_a2",sec:"ACCESS",name:"Dips",sets:3,rest:90,muscle:"Lower Chest · Triceps · Anterior Deltoid",
       rirNote:"Basic pressing strength — high anterior shoulder stress at age 15, so leave a strict safety margin.",
       curLv:1,levels:[
         {n:"Bench Dips",pose:"bench-dip",d:"Hands behind on a bench, feet on the floor",reps:"10–12 reps",rir:"RIR 1",
          cues:["Hands behind you on a bench, feet out in front on the floor","Lower by bending the elbows straight back, not flaring wide","Stop when upper arms reach roughly parallel to the floor","Use this to build tricep strength before bar dips"]},
         {n:"Parallel Bar Dips",pose:"dip",d:"Standard bar dips — your current working level",reps:"6–8 reps",rir:"RIR 1–2",
          cues:["Lean forward slightly for chest, stay upright for triceps","Shoulder caps BELOW elbows at the bottom","Build depth GRADUALLY — don't rush at age 15","Full lockout at top = complete tricep squeeze","6 clean reps > 8 sloppy reps every time"]},
         {n:"Deep Dips",pose:"dip",d:"Same bars, increased range of motion at the bottom",reps:"5–7 reps",rir:"RIR 2",
          cues:["Only add depth once standard dips feel completely controlled","Shoulders travel below elbow height — go gradually, not all at once","Stop descending the moment you feel any anterior shoulder pinch","Depth earns strength only when it stays pain-free"]},
         {n:"Straight Bar Dips",pose:"dip",d:"Single straight bar instead of parallel bars",reps:"5–7 reps",rir:"RIR 2",
          cues:["Hands gripping one straight bar rather than two parallel ones","Grip width is fixed by the bar — adjust body lean accordingly","Slightly more wrist and forearm demand than parallel bars","Same depth and lockout standards apply"]},
         {n:"L-Sit Dips",pose:"lsit-dip",d:"Dips performed with legs held horizontal throughout",reps:"3–5 reps",rir:"RIR 2",
          cues:["Lock the L-sit position before starting the dip, not mid-rep","Hips stay lifted and legs straight for the entire set","This combines compression strength with pressing strength","Expect noticeably fewer reps than standard dips"]},
         {n:"Weighted (age 16+)",pose:"dip",d:"Add load via a dip belt",reps:"4–6 reps",rir:"RIR 2",
          cues:["Wait until age 16 — shoulder joints are still maturing before that","Start with the smallest available weight increment","Depth and lockout standards don't change just because weight is added","Drop back to bodyweight immediately if form degrades"]},
         {n:"Ring Dips",pose:"dip",d:"Performed on gymnastic rings for added instability",reps:"4–6 reps",rir:"RIR 2–3",
          cues:["Rings move — expect a stability challenge on top of the strength one","Turn the rings out slightly at the bottom to protect the shoulders","Control the wobble rather than fighting it stiffly","Build ring support holds before attempting ring dip reps"]},
         {n:"Korean Dips",pose:"dip",d:"Hands set behind the body on a single bar, deep range",reps:"3–5 reps",rir:"RIR 2–3",
          cues:["Hands grip a bar set behind the body, not beside it","This is an advanced shoulder and chest stretch under load","Only attempt with excellent shoulder mobility already established","Go slowly — this is the deepest range any dip variation uses"]}
       ]},
      {id:"t_c1",sec:"COOLDOWN",name:"Chest + Anterior Shoulder Opener",sets:1,rest:15,muscle:"Pectorals · Anterior Deltoid",
       rirNote:"Closing stretch — ease in, never force range.",
       curLv:0,levels:[
         {n:"Chest opener sequence",pose:"stretch-standing",d:"Doorframe and overhead stretch combination",reps:"45 sec each position",rir:"RIR 4+",
          cues:["Doorframe: forearm vertical on frame, step through and rotate chest away","Overhead: arm straight up, use other hand to push back gently","Feel the stretch across the chest and front of shoulder","Breathe and relax — never force"]}
       ]},
      {id:"t_c2",sec:"COOLDOWN",name:"Tricep Overhead Stretch",sets:1,rest:15,muscle:"Triceps · Long Head",
       rirNote:"Gentle release — hold steady, don't bounce.",
       curLv:0,levels:[
         {n:"Overhead Tricep Stretch",pose:"stretch-arm",d:"Elbow bent behind the head, gently pressed",reps:"30 sec each arm",rir:"RIR 4+",
          cues:["Raise arm overhead, bend elbow behind head","Use other hand to gently push elbow back further","Feel stretch down the back of the arm","Hold steady — 30 seconds minimum"]}
       ]},
      {id:"t_c3",sec:"COOLDOWN",name:"Wrist Circles + Finger Stretches",sets:1,rest:0,muscle:"Wrists · Forearms · Fingers",
       rirNote:"Recovery work — never loaded into discomfort.",
       curLv:0,levels:[
         {n:"Wrist Mobility Routine",pose:"circle-arms",d:"Circles, prayer stretch, and finger release",reps:"2 min continuous",rir:"RIR 4+",
          cues:["Full wrist circles: 10 each direction","Prayer hands: press palms together and hold 20s","Reverse prayer: backs of hands pressed together","Quadruped rock: weight on hands, rock forward and back","Shake hands out to finish — release all tension"]},
         {n:"Loaded Wrist Prep",pose:"circle-arms",d:"Adds gentle weight-bearing wrist extension",reps:"90 sec continuous",rir:"RIR 4+",
          cues:["Lean body weight gently into flat palms on the floor","Only add this once the basic mobility routine feels easy","This builds the wrist extension range planche work demands","Back off immediately if you feel any sharp wrist pain"]}
       ]},
    ]
  },
  3: {
    name:"Core & Skills", day:"Wednesday", icon:"⚡", col:"#fbbf24", grad:["#d97706","#92400e"],
    tip:"Handstand day. Balance is a skill you rehearse, not a strength you grind out — frequent quality holds beat occasional long ones.",
    exercises:[
      {id:"w_w1",sec:"WARMUP",name:"Cat-Cow + Spine Rolls",sets:1,rest:0,muscle:"Spine Mobility · Core Activation",
       rirNote:"Gentle spinal warm-up — never forced.",
       curLv:0,levels:[
         {n:"Cat-Cow",pose:"cat-cow",d:"Alternating spinal flexion and extension on hands and knees",reps:"10 reps each",rir:"RIR 4+",
          cues:["Cat: round spine, tuck pelvis, chin to chest","Cow: arch back, lift chest and tailbone","Move slowly — feel each vertebra sequentially","Wakes up the spinal extensors and core connections"]}
       ]},
      {id:"w_w2",sec:"WARMUP",name:"Hollow Body Rocks",sets:2,rest:30,muscle:"Core · Hip Flexors · Serratus",
       rirNote:"This is a warm-up rehearsal of the shape, not a working set — keep it light.",
       curLv:1,levels:[
         {n:"Dead Bug Hold",pose:"dead-bug",d:"Opposite arm and leg extended, lower back pinned flat",reps:"8 reps each side",rir:"RIR 4+",
          cues:["Lie on your back, knees and arms up toward the ceiling","Press lower back flat into the floor and hold it there","Slowly extend one arm and the opposite leg, then return","This is the gentlest entry point to the hollow position"]},
         {n:"Tuck Hollow Hold",pose:"tuck-hollow",d:"Knees pulled to chest, lower back flat",reps:"10 sec",rir:"RIR 4+",
          cues:["Knees pulled in tight to the chest, shoulders curled slightly up","Lower back stays glued to the floor the entire hold","Arms can reach toward the knees for an easier lever","Short lever makes this the easiest true hollow-body hold"]},
         {n:"Hollow Body Hold",pose:"hollow",d:"Arms and legs extended, banana-shaped hold",reps:"15–20 sec",rir:"RIR 4+",
          cues:["Lower back FLAT on floor — non-negotiable","Arms overhead, legs raised — banana shape","Press lower back INTO the floor the entire time","If back lifts → bend knees or raise legs higher"]},
         {n:"Hollow Body Rocks",pose:"hollow",d:"Same shape, rocking gently forward and back",reps:"10 reps",rir:"RIR 4+",
          cues:["Hold the full hollow shape, then rock as a single rigid unit","The lower back must stay flat through the entire rock","Small, controlled rocks — this isn't momentum-driven","Stop the moment the shape breaks down"]},
         {n:"Full extension Rocks",pose:"hollow",d:"Arms reaching toward the feet, maximum lever length",reps:"8 reps",rir:"RIR 4+",
          cues:["Arms point toward the feet rather than overhead — longer lever","This is the hardest hollow variation in the warm-up family","Expect to hold the shape for less time than the overhead version","Only use this once standard rocks feel easy"]}
       ]},
      {id:"w_w3",sec:"WARMUP",name:"Arch Body Rocks",sets:2,rest:30,muscle:"Spinal Extensors · Glutes",
       rirNote:"Warm-up rehearsal — keep this light and controlled.",
       curLv:0,levels:[
         {n:"Arch Body Hold",pose:"arch-hold",d:"Face-down, chest and legs lifted, static hold",reps:"15–20 sec",rir:"RIR 4+",
          cues:["Lie face down, arms overhead","Lift chest AND legs simultaneously — squeeze glutes","Hold the shape steady without rocking yet","This mirrors the hollow hold but on the opposite side of the body"]},
         {n:"Arch Body Rocks",pose:"arch-hold",d:"Same shape, rocking forward and backward",reps:"10 reps",rir:"RIR 4+",
          cues:["Lie face down, arms overhead","Lift chest AND legs simultaneously — squeeze glutes","Rock forward and backward — mirror of the hollow","These two shapes (hollow + arch) are the backbone of gymnastics movement"]}
       ]},
      {id:"w_s1",sec:"SKILLS",name:"Handstand Hold",sets:4,rest:90,muscle:"Shoulders · Wrists · Core · Balance",
       rirNote:"Leave enough energy to safely exit or dismount the wall.",
       curLv:1,levels:[
         {n:"Pike Against Wall",pose:"pike-wall",d:"Feet on the wall, hips bent, hands on the floor",reps:"20–30 sec",rir:"RIR 1",
          cues:["Feet on the wall, hips bent into a pike, hands on the floor","Push the floor away through straight arms","This builds shoulder strength without the fear of falling","Walk feet down the wall slightly each session as it gets easier"]},
         {n:"Wall Handstand",pose:"handstand",d:"Facing the wall, hands close to its base",reps:"15–25 sec",rir:"2s Reserve",
          cues:["FACE the wall — hands 10–15 cm from base","SQUEEZE everything: glutes, core, legs, pointed toes","Push the floor AWAY — actively press, don't just balance","Eyes on the floor between hands — not behind you","15s quality hold beats a shaky 30s every time"]},
         {n:"Chest-to-Wall HS",pose:"handstand",d:"Facing away from the wall, chest and toes touching it",reps:"10–20 sec",rir:"2–3s Reserve",
          cues:["Kick up with your back to the wall, chest and toes lightly touching","This forces a correctly stacked, hollow-body alignment","Harder to set up than facing the wall, but better posture carryover","Use a spotter or soft landing zone the first few attempts"]},
         {n:"HS Away from Wall",pose:"handstand",d:"Practising small balance corrections off the wall",reps:"3–8 sec",rir:"3s Reserve",
          cues:["Kick up facing the wall, then gently push away from it","Make small wrist and finger adjustments to find balance","Expect very short holds at first — a few seconds is a win","Always have the wall within reach as a safety net"]},
         {n:"Freestanding HS",pose:"handstand",d:"Full handstand with no wall at all",reps:"2–5 sec",rir:"3–4s Reserve",
          cues:["Only attempt once away-from-wall holds feel consistently findable","Cartwheel or step out of a fall — never force a rigid landing","Small continuous finger and wrist corrections keep you balanced","This takes months of practice — celebrate every extra second"]}
       ]},
      {id:"w_v1",sec:"VOLUME",name:"Wall Handstand Practice",sets:4,rest:60,muscle:"Shoulders · Wrists · Core",
       rirNote:"Higher-frequency, lower-risk handstand reps that build the base under your SKILLS-tier freestanding work.",
       curLv:1,levels:[
         {n:"Pike Hold Against Wall",pose:"pike-wall",d:"Feet on the wall, hips bent, hands on the floor",reps:"20–30 sec",rir:"RIR 1",
          cues:["Feet on the wall, hips bent into a pike, hands on the floor","Push the floor away through straight arms","No fall risk here — use it to build raw shoulder strength","Walk feet down the wall slightly each week as it gets easier"]},
         {n:"Wall Walk-ups",pose:"pike-wall",d:"Walking the feet up the wall into a vertical handstand",reps:"4–6 reps",rir:"RIR 1–2",
          cues:["Start in a pike position, walk feet up the wall toward vertical","Walk back down with control rather than just dropping off","This builds confidence and shoulder strength through the full range","Stop walking up once the body feels solidly stacked, not before"]},
         {n:"Wall Handstand Hold",pose:"handstand",d:"Full handstand, facing the wall, for high-frequency practice",reps:"15–25 sec",rir:"RIR 2",
          cues:["Face the wall, hands 10–15cm from the base","Push the floor away — actively press, don't just balance","Use this for frequent practice volume, separate from your max-effort SKILLS hold","Quality reps here build the strength freestanding balance needs"]}
       ]},
      {id:"w_v2",sec:"VOLUME",name:"Hollow Body Hold",sets:4,rest:60,muscle:"Full Core · Hip Flexors · Serratus",
       rirNote:"Instant stop rule — the moment the lower back lifts off the floor, the set is over.",
       curLv:1,levels:[
         {n:"Dead Bug Hold",pose:"dead-bug",d:"Opposite arm/leg extensions with the back pinned flat",reps:"10 reps each side",rir:"RIR 1",
          cues:["Lie on your back, knees and arms toward the ceiling","Lower back pressed flat into the floor throughout","Extend one arm and the opposite leg slowly, then switch","The instant the lower back lifts, reset the position"]},
         {n:"Hollow Body Hold",pose:"hollow",d:"THE foundation static hold — arms and legs extended",reps:"20–30 sec",rir:"2–3s Reserve",
          cues:["THE foundation of every advanced calisthenics skill","Lower back FLAT — any lift = fail, bend knees and reset","Present in pull-ups, muscle-ups, planches, everything","This isn't an ab exercise — it's a total-body tension skill"]},
         {n:"Hollow Body Rocks",pose:"hollow",d:"Maintaining the hold while rocking as a single unit",reps:"10–15 reps",rir:"RIR 1–2",
          cues:["Hold the full hollow shape, then rock forward and back","The shape must survive the movement, not just the static hold","Small rocks only — this is control, not momentum","Stop the set the moment the shape starts to break"]},
         {n:"L-Sit",pose:"lsit",d:"Hips lifted, legs extended horizontal, hands on the floor",reps:"5–8 sec",rir:"RIR 2",
          cues:["Hands flat beside the hips, press down to lift off the floor","Legs extend out straight and horizontal","This adds a compression and pressing demand on top of hollow tension","Even a few seconds is a genuine achievement"]},
         {n:"V-Sit",pose:"vsit",d:"Legs lifted above horizontal, forming a V shape",reps:"3–5 sec",rir:"RIR 2–3",
          cues:["Same compression as the L-sit, legs lifted even higher","Hamstring and hip flexor flexibility become limiting factors here","Keep the chest lifted, don't round forward to compensate","An advanced compression skill — be patient building toward it"]}
       ]},
      {id:"w_a1",sec:"ACCESS",name:"Long Lever Plank",sets:3,rest:45,muscle:"Full Core Chain · Shoulders",
       rirNote:"Basic core training — end the set when the pelvic tilt slips into extension (lumbar arching).",
       curLv:0,levels:[
         {n:"Standard Plank",pose:"plank",d:"Elbows under shoulders — the easiest static core hold",reps:"45–60 sec",rir:"RIR 1",
          cues:["Elbows directly under shoulders, forearms flat on the floor","Body forms one straight line from head to heels","Squeeze the glutes lightly to keep the hips from sagging","A reliable baseline before increasing the lever length"]},
         {n:"Long Lever Plank",pose:"plank",d:"Hands set further forward than a standard plank",reps:"30–45 sec",rir:"2s Reserve",
          cues:["Arms FULLY extended, hands further forward than regular plank","Increased lever arm = dramatically harder than standard plank","Hips must stay perfectly level — don't rise or sag","Squeeze glutes and legs actively throughout","Closest floor equivalent to planche body tension"]},
         {n:"RKC Plank",pose:"plank",d:"Maximum total-body tension version of the plank",reps:"15–20 sec",rir:"RIR 2",
          cues:["Forearms on the floor, but actively pull elbows toward the toes","Squeeze glutes and quads as hard as possible throughout","This trades duration for intensity — holds will be much shorter","The goal is maximum tension, not a long clock time"]},
         {n:"Dragon Flag Negatives",pose:"dragon-flag",d:"Controlled lowering from a shoulder-supported straight-body position",reps:"3–5 reps",rir:"RIR 2–3",
          cues:["Support the upper back on a bench, body straight and rigid","Lower the straight body slowly from vertical toward the floor","Stop before the lower back is forced to round","This is one of the most advanced core-strength movements there is"]}
       ]},
      {id:"w_a2",sec:"ACCESS",name:"L-Sit Attempts (Floor)",sets:3,rest:60,muscle:"Hip Flexors · Triceps · Core",
       rirNote:"Basic core training — max-effort compression, stop when the hips can no longer clear the floor.",
       curLv:0,levels:[
         {n:"Hip Lift",pose:"hip-lift",d:"Pressing the hips just barely off the floor",reps:"10–15 sec",rir:"RIR 1",
          cues:["Sit on floor, hands flat beside hips","Press DOWN to lift hips off floor","Try to extend legs — even partially counts","This builds compression strength for front lever and planche","Track max hold time each session"]},
         {n:"Tuck L-Sit",pose:"tuck-lsit",d:"Knees bent to the chest, feet off the floor",reps:"8–12 sec",rir:"RIR 1–2",
          cues:["Hips lifted, knees pulled tight to the chest","Feet stay off the floor for the entire hold","Shorter lever makes this more achievable than a straight-leg hold","Build hold time here before straightening the legs"]},
         {n:"L-Sit",pose:"lsit",d:"Legs fully extended and horizontal",reps:"5–10 sec",rir:"RIR 1",
          cues:["Press the hips up, legs extending fully straight and horizontal","Shoulders stay depressed, not shrugged toward the ears","Even 5 clean seconds is a serious compression achievement","Lower with control rather than collapsing down"]},
         {n:"V-Sit",pose:"vsit",d:"Legs raised above horizontal, forming a V",reps:"3–6 sec",rir:"RIR 2",
          cues:["Same pressing base as the L-sit, legs lifted higher still","Hamstring flexibility becomes the main limiting factor","Keep the chest tall instead of rounding forward to compensate","An advanced compression goal — patience pays off here"]}
       ]},
      {id:"w_c1",sec:"COOLDOWN",name:"Hip Flexor Stretch",sets:1,rest:15,muscle:"Hip Flexors · Psoas",
       rirNote:"Cooldown stretch — ease in gradually.",
       curLv:0,levels:[
         {n:"Kneeling Lunge",pose:"stretch-kneeling",d:"Half-kneeling position, hips pressed forward",reps:"45 sec each side",rir:"RIR 4+",
          cues:["Kneeling lunge — push hips FORWARD and down","Feel stretch at the front of the back hip","Raise same-side arm overhead to deepen it","Your hip flexors worked hard in hollow body and leg raises"]},
         {n:"Couch Stretch",pose:"stretch-kneeling",d:"Back foot elevated behind you on a chair",reps:"45 sec each side",rir:"RIR 4+",
          cues:["Back foot elevated behind you on a chair or couch","Keep the front shin vertical and hips squared forward","This reaches a much deeper hip flexor and quad stretch","Ease in gradually — this position is intense"]}
       ]},
      {id:"w_c2",sec:"COOLDOWN",name:"Thoracic Rotation Stretch",sets:1,rest:0,muscle:"Thoracic Spine · Obliques",
       rirNote:"Gentle mobility — never force the rotation.",
       curLv:0,levels:[
         {n:"Side-lying rotation",pose:"stretch-rotate",d:"Lying on side, rotating the upper arm across the body",reps:"8 reps each side",rir:"RIR 4+",
          cues:["Lie on side, both knees at 90°","Rotate upper arm to opposite side, let chest follow","Hold 3 seconds at the end range","Essential for handstand alignment and shoulder health"]}
       ]},
      {id:"w_c3",sec:"COOLDOWN",name:"Wrist + Shoulder Mobility Flow",sets:1,rest:0,muscle:"Wrists · Shoulders",
       rirNote:"Recovery flow — keep it gentle.",
       curLv:0,levels:[
         {n:"Mobility Flow",pose:"circle-arms",d:"Wrist circles, prayer stretch, and shoulder rolls combined",reps:"2 min continuous",rir:"RIR 4+",
          cues:["Wrist circles: 10 each direction","Prayer hands: press together and hold 20s","Reverse prayer: backs of hands pressed together","Shoulder rolls: 10 forward, 10 backward","Finish with gentle arm swings across body"]},
         {n:"Loaded Wrist Prep",pose:"circle-arms",d:"Leaning weight into extended palms",reps:"90 sec continuous",rir:"RIR 4+",
          cues:["Lean gently into flat palms on the floor, fingers pointing back","Only add this once the basic flow feels completely easy","Builds the wrist extension range that handstands and planche demand","Stop immediately if you feel any sharp wrist pain"]}
       ]},
    ]
  },
  4: {
    name:"Pull B", day:"Thursday", icon:"↔️", col:"#a78bfa", grad:["#7c3aed","#5b21b6"],
    tip:"Second front lever session of the week. Rows from the lever position are some of the most advanced pulling work in calisthenics.",
    exercises:[
      {id:"th_w1",sec:"WARMUP",name:"Band Pull-Aparts",sets:2,rest:20,muscle:"Rear Delts · Rhomboids",
       rirNote:"Activation only — keep it light before the real pulling work.",
       curLv:0,levels:[
         {n:"Pull-Aparts",pose:"band-pull",d:"Band held at shoulder height, pulled apart",reps:"15 reps",rir:"RIR 4+",
          cues:["Hold band at shoulder height, arms straight","Pull apart until band touches chest","Squeeze between shoulder blades at the end","Pre-activates the exact muscles used in rows"]},
         {n:"Face Pulls",pose:"band-pull",d:"Band pulled toward the face, elbows high",reps:"12 reps",rir:"RIR 4+",
          cues:["Anchor the band at roughly face height","Pull toward your face leading with the elbows","Elbows finish above wrist height at the end","Targets the rear delts and rotator cuff more directly than a flat pull-apart"]}
       ]},
      {id:"th_w2",sec:"WARMUP",name:"Shoulder Rotations + Arm Swings",sets:1,rest:0,muscle:"Shoulder Capsule · Rotator Cuff",
       rirNote:"Mobility prep only.",
       curLv:0,levels:[
         {n:"Bodyweight rotations",pose:"circle-arms",d:"Internal/external rotation plus cross-body swings",reps:"30 sec each",rir:"RIR 4+",
          cues:["Internal/external rotations with arm at side","Then arm at 90° — rotate forearm up and down","Finish with cross-body arm swings","Opens the shoulder capsule for horizontal pulling"]}
       ]},
      {id:"th_w3",sec:"WARMUP",name:"Dead Hang",sets:2,rest:30,muscle:"Grip · Shoulder Decompression",
       rirNote:"Passive prep — same principle as Monday's hang, never push toward fatigue.",
       curLv:0,levels:[
         {n:"Dead Hang",pose:"hang",d:"Relaxed full-body hang to prime grip",reps:"20–30 sec",rir:"RIR 4+",
          cues:["Same warm-up hang as Monday","Today you're priming grip for row variations","Breathe deep — decompress before the work begins"]},
         {n:"L-Hang",pose:"l-hang",d:"Hang with legs raised to 90°",reps:"15–20 sec",rir:"RIR 4+",
          cues:["Lift straight legs to hip height once hanging comfortably","Lower back rounds slightly — that's the hollow shape in the air","Keep shoulders pulled down rather than shrugged","Lower the legs with control instead of dropping them"]}
       ]},
      {id:"th_s1",sec:"SKILLS",name:"Front Lever Hold",sets:4,rest:90,muscle:"Lats · Core · Shoulders · Full Posterior Chain",
       rirNote:"Second lever session of the week — fatigue from Monday is normal, so don't chase a new personal best today.",
       curLv:0,levels:[
         {n:"Tuck Front Lever Hold",pose:"front-lever-tuck",d:"Knees tucked tight to the chest, hanging horizontal",reps:"8–12 sec",rir:"2s Reserve",
          cues:["Same tuck shape as Monday — today is about consistency, not a new max","Pull knees tight to the chest, rotate the hips so the back stays flat","Active shoulders — push the bar away rather than just hanging","If Monday's volume left you fatigued, shorter clean holds are fine"]},
         {n:"Advanced Tuck Front Lever",pose:"front-lever-adv-tuck",d:"Hips open slightly, knees still tucked but further from the chest",reps:"6–10 sec",rir:"2s Reserve",
          cues:["Hips a little more open than the basic tuck, knees still bent","Compare today's hold quality to Monday's — look for steadiness, not just time","If the hips sag, tuck back in tighter rather than fighting it","This is where real lever strength starts to show up"]},
         {n:"Single-Leg Front Lever",pose:"front-lever-single",d:"One leg extended straight, the other still tucked",reps:"4–8 sec",rir:"2–3s Reserve",
          cues:["One leg straight, the other tucked — alternate sides from Monday's order","A genuinely advanced position, expect shorter holds than the tuck","Keep hips square — don't let them rotate toward the bent leg","Two lever sessions a week is what actually builds this skill"]},
         {n:"Straddle Front Lever",pose:"front-lever-straddle",d:"Both legs straight and spread wide, shortening the lever",reps:"3–6 sec",rir:"3s Reserve",
          cues:["Wide straddle to shorten the lever — narrow it over months, not weeks","Hips and shoulders level — no sagging through the middle","If this felt impossible Monday, even a 2-second hold today is progress","This bridges directly into the full front lever"]},
         {n:"Full Front Lever",pose:"front-lever",d:"Legs together and straight — the complete skill",reps:"2–5 sec",rir:"3–4s Reserve",
          cues:["Legs together, fully straight — the complete skill","Only chase this once straddle holds are genuinely solid","Active shoulders throughout, never a passive hang","Two clean seconds, twice a week, beats one shaky attempt once"]}
       ]},
      {id:"th_s2",sec:"SKILLS",name:"Front Lever Rows",sets:3,rest:90,muscle:"Lats · Biceps · Core",
       rirNote:"An elite strength-endurance drill — stop the moment the lever shape collapses, not just when reps get hard.",
       curLv:0,levels:[
         {n:"Tuck Front Lever Pull",pose:"front-lever-row",d:"Pull from a tuck front lever position toward the bar",reps:"3–5 reps",rir:"RIR 1–2",
          cues:["Hold a tuck front lever, then pull your chest toward the bar","Lower back to the tuck hold position, don't drop to a full hang","This blends a row with a lever hold — genuinely advanced work","Stop the set if the tuck shape starts to open up under fatigue"]},
         {n:"Advanced Tuck Row",pose:"front-lever-row",d:"Same row pattern from a more open tuck position",reps:"3–4 reps",rir:"RIR 2",
          cues:["Same pulling pattern, performed from the more open tuck shape","Each pull should be a clean, controlled row — not a kip","Reset to the hold position between reps, not a dead hang","A serious step up in difficulty from the basic tuck row"]},
         {n:"Straddle Front Lever Row",pose:"front-lever-row",d:"Rowing reps performed from a straddle lever position",reps:"2–3 reps",rir:"RIR 2–3",
          cues:["Hold a straddle front lever, then pull your chest to the bar","This is an elite-tier combination of lever strength and pulling power","Even a single clean rep here is a genuine achievement","Stop immediately if the straddle shape breaks down mid-pull"]}
       ]},
      {id:"th_v1",sec:"VOLUME",name:"Tuck Front Lever Hold",sets:3,rest:60,muscle:"Lats · Core",
       rirNote:"Continued volume work — building the time-under-tension base that feeds Monday and Thursday's skill attempts.",
       curLv:0,levels:[
         {n:"Dead Bug Hang",pose:"dead-bug-hang",d:"Hang with knees bent close to the chest, very short lever",reps:"10–15 sec",rir:"RIR 1",
          cues:["Same short-lever hang as Monday, knees pulled close to the chest","Use this to warm back into the tuck position after two days off","Keep the lower back flat against gravity's pull","A gentle entry before the harder tuck holds"]},
         {n:"Tuck Front Lever Hold",pose:"front-lever-tuck",d:"Standard tuck hold, performed for longer total volume",reps:"15–20 sec",rir:"RIR 1–2",
          cues:["Standard tuck hold, accumulated across the full set","Compare your total time today to Monday — small gains count","Spread the hold across shorter chunks if needed, that's fine","Active shoulders the whole time, never a passive hang"]},
         {n:"Advanced Tuck Hold",pose:"front-lever-adv-tuck",d:"Hips slightly more open, longer total accumulated time",reps:"12–18 sec",rir:"RIR 2",
          cues:["Hips a touch more open than the basic tuck","This is genuinely demanding by the second lever day of the week","Quality holds beat grinding out extra seconds with bad shape","Breathe steadily — don't hold your breath through the set"]},
         {n:"Single-Leg Tuck Hold",pose:"front-lever-single",d:"One leg extended, building toward the straddle and full lever",reps:"8–12 sec",rir:"RIR 2",
          cues:["One leg extended, alternating sides from Monday's pattern","Use this once advanced tuck holds feel comfortable for 18+ seconds","Patience here directly shortens the road to a straddle lever","Stop and reset the moment the hips start to sag"]}
       ]},
      {id:"th_v2",sec:"VOLUME",name:"Front Lever Raises",sets:3,rest:75,muscle:"Lats · Core · Hip Flexors",
       rirNote:"Second dose of lever-specific raises this week — small week-to-week rep gains are the goal, not a single big jump.",
       curLv:0,levels:[
         {n:"Hanging Knee Tuck Pulls",pose:"front-lever-tuck",d:"From a hang, pull the knees up and slightly back, then lower",reps:"8–10 reps",rir:"RIR 1",
          cues:["Pull the knees up and slightly back from a dead hang","A good warm-up set before the harder tuck raises below","Lower with control rather than swinging the legs back down","Builds the same motor pattern the tuck front lever depends on"]},
         {n:"Tuck Front Lever Raises",pose:"front-lever-tuck",d:"Pull into a tuck front lever, then lower and repeat",reps:"6–8 reps",rir:"RIR 1–2",
          cues:["Pull into a full tuck front lever, then lower under control","Compare today's rep quality to Monday's, not just the count","Every rep should look identical — no rushing the final ones","This is the main strength-building set for the lever this week"]},
         {n:"Advanced Tuck Raises",pose:"front-lever-adv-tuck",d:"Same raise, hips more open at the top",reps:"5–8 reps",rir:"RIR 2",
          cues:["Same raise, hips opened slightly more at the top position","A noticeable jump in difficulty from the basic tuck raise","Pause briefly at the top of each rep to confirm a clean shape","Two sessions a week here builds real straddle-lever strength"]},
         {n:"Straddle Raises",pose:"front-lever-straddle",d:"Pull into a straddle front lever, then lower and repeat",reps:"4–6 reps",rir:"RIR 2",
          cues:["Legs straight and wide at the top of each pull","An elite-tier raise — even 4 clean reps is a real achievement","Keep the straddle wide enough to protect your form","Narrow it gradually over months as strength builds"]}
       ]},
      {id:"th_a1",sec:"ACCESS",name:"Pull-ups",sets:3,rest:120,muscle:"Lats · Biceps · Core",
       rirNote:"Basic pulling strength, continued from Monday — pre-fatigued from rows, so maintain strict dead-hang lockouts.",
       curLv:4,levels:[
         {n:"Dead Hang",pose:"hang",d:"Foundation hang to rebuild grip after rowing",reps:"30–45 sec",rir:"RIR 1",
          cues:["Hang fully from the bar, arms completely straight","Shoulders active and pulled down, not shrugged up","Use this if grip feels fried from the row volume","Builds back toward a true dead-hang pull-up standard"]},
         {n:"Scapular Pull-ups",pose:"scap-hang",d:"Shoulder-blade pull before adding elbow bend",reps:"10–15 reps",rir:"RIR 1",
          cues:["Arms stay straight, only the shoulder blades move","Pull down and together, then control back up","A good regression option on a day when rows have pre-fatigued the lats","10–15 clean reps here before chasing a bent-arm pull"]},
         {n:"Negatives",pose:"pullup-negative",d:"Step to the top, lower under control",reps:"4–5 reps",rir:"RIR 1",
          cues:["Step or jump to chin-over-bar position","Lower over 5–6 seconds, fighting gravity the whole way","Reset to a full dead hang at the bottom","Builds the same strength curve your pull-up needs, minus the pull"]},
         {n:"Chin-ups",pose:"pullup",d:"Supinated grip — often allows an extra rep or two",reps:"Max reps",rir:"RIR 1",
          cues:["Palms facing you — supinated grip","Often feels easier than pull-ups thanks to extra bicep involvement","Still a full dead-hang start with no cheating","A smart substitute on days the back grip feels fatigued"]},
         {n:"Pull-ups",pose:"pullup",d:"Strict reps after rowing",reps:"Max reps",rir:"RIR 1",
          cues:["After rows your lats are ALREADY activated — use that","Try chin-ups today — often 1–2 extra reps possible","Compare to Monday — should feel stronger","Clean reps only — never chase numbers with bad form"]},
         {n:"×5 reps",pose:"pullup",d:"Five consecutive strict reps",reps:"5 reps",rir:"RIR 1–2",
          cues:["Same dead-hang start and full chin clearance as your max-rep sets","Reps 4–5 are where form most often leaks — watch for kipping","If hips start swinging, that's your true count for today","Quality across all 5 beats grinding out a sloppy 6th"]},
         {n:"×10 reps",pose:"pullup",d:"Ten reps — genuine pulling endurance",reps:"10 reps",rir:"RIR 2",
          cues:["Pace the first few reps — don't sprint and gas out early","Breathe out on the pull, in on the controlled lower","A slight slow-down around rep 7–8 is completely normal","Stop the moment the dead-hang reset disappears between reps"]},
         {n:"L-Sit Pull-ups",pose:"lsit-pullup",d:"Pull-ups performed with legs held horizontal",reps:"3–5 reps",rir:"RIR 2",
          cues:["Lock the L-sit before pulling, not partway through the rep","Hips stay high the entire rep, no dropping legs to cheat","A serious combined core-and-lat demand","Expect far fewer reps than your normal pull-up max"]},
         {n:"Weighted",pose:"weighted-pullup",d:"Added load via a dip belt or vest (age 16+)",reps:"3–5 reps",rir:"RIR 2–3",
          cues:["Not recommended until age 16 — let growth plates mature first","Start with the smallest available weight increment","Same dead-hang standard applies regardless of added load","Reduce reps before ever reducing range of motion"]}
       ]},
      {id:"th_a2",sec:"ACCESS",name:"Inverted Bodyweight Rows",sets:3,rest:75,muscle:"Mid-Traps · Rhomboids · Rear Delts · Biceps",
       rirNote:"Basic pulling strength — focus on maximum scapular retraction, pinching the shoulder blades together.",
       curLv:1,levels:[
         {n:"Incline Rows",pose:"incline-row",d:"Bar set higher, body upright — easiest entry",reps:"12–15 reps",rir:"RIR 1",
          cues:["Set the bar around waist height for an easy, steep angle","Body STRAIGHT from head to heels — plank rigid","Pull chest to the bar, squeeze the shoulder blades together","Build the pattern here before lowering the bar height"]},
         {n:"Inverted Rows",pose:"row",d:"Bar at chest height, body near-horizontal",reps:"10–12 reps",rir:"RIR 1",
          cues:["Body STRAIGHT from head to heels — plank rigid","Pull bar to LOWER chest — not neck or chin","Squeeze shoulder blades TOGETHER at the top","Elbows at 45° — not a T-shape out to the sides","Lower the bar or elevate feet to increase difficulty"]},
         {n:"Feet-Elevated Rows",pose:"row",d:"Feet up on a chair — fully horizontal",reps:"8–10 reps",rir:"RIR 1–2",
          cues:["Feet on a chair, body forming one straight line","This is meaningfully harder than flat-footed inverted rows","If hips sag below the line, lower the feet a notch","Chest still drives to the bar every single rep"]},
         {n:"Weighted Rows",pose:"row",d:"Add a weight plate or vest for extra load",reps:"6–8 reps",rir:"RIR 2",
          cues:["Place light weight on the chest or wear a weighted vest","Same straight-body standard applies regardless of added load","Drop the weight immediately if the plank position breaks down","Small load increases go a long way on a bodyweight row"]},
         {n:"Archer Rows",pose:"archer-row",d:"Pulling toward one hand while the other stays long",reps:"5–7 reps each side",rir:"RIR 2",
          cues:["Pull your chest toward one hand, not straight up the middle","The straight arm stabilizes and guides, it doesn't drive the pull","Control the lateral shift rather than letting momentum take over","Switch the working side every set"]},
         {n:"One-Arm Row",pose:"archer-row",d:"Full bodyweight row on a single arm",reps:"2–4 reps each side",rir:"RIR 2–3",
          cues:["Use a towel grip or single handle for a true one-arm pull","Keep hips and shoulders square, resisting any twist","Years of archer row practice should precede this attempt","Lower with the same control used to pull up"]}
       ]},
      {id:"th_c1",sec:"COOLDOWN",name:"Lat + Teres Major Stretch",sets:1,rest:15,muscle:"Latissimus Dorsi",
       rirNote:"Closing stretch — ease in rather than forcing range.",
       curLv:0,levels:[
         {n:"Doorframe Stretch",pose:"stretch-standing",d:"Standing stretch using a doorframe",reps:"45 sec each side",rir:"RIR 4+",
          cues:["Grab pole or doorframe overhead","Let body lean away — feel the entire lat release","You worked these muscles hard today — give them care","Breathe deeply into the stretch for maximum release"]},
         {n:"Bar Hang Stretch",pose:"hang",d:"Passive hang and lean from a pull-up bar",reps:"30 sec each side",rir:"RIR 4+",
          cues:["Hang from the bar, then walk feet to one side","Let the lat lengthen under light bodyweight load","Deeper than the doorframe version — ease in gradually","Only use once the doorframe version feels too gentle"]}
       ]},
      {id:"th_c2",sec:"COOLDOWN",name:"Bicep + Forearm Stretch",sets:1,rest:15,muscle:"Biceps · Forearm Flexors",
       rirNote:"Tendons stretch slowly — never bounce.",
       curLv:0,levels:[
         {n:"Manual Stretch",pose:"stretch-arm",d:"Hand-assisted forearm stretch",reps:"30 sec each arm",rir:"RIR 4+",
          cues:["Extend arm fully, palm up, pull fingers back","Hold steady — tendons adapt slowly over time","Never bounce — tendons are not like muscles","Both arms got heavy eccentric loading today"]},
         {n:"Wall-Assisted Stretch",pose:"stretch-arm",d:"Palm pressed flat against a wall",reps:"30 sec each arm",rir:"RIR 4+",
          cues:["Press palm flat against a wall, fingers pointing down","Lean body weight gently away to deepen the stretch","Reaches further than the manual version","Ease in slowly, never force the angle"]}
       ]},
      {id:"th_c3",sec:"COOLDOWN",name:"Shoulder + Neck Full Release",sets:1,rest:0,muscle:"Shoulder · Upper Traps · Neck",
       rirNote:"Closing sequence — unhurried and gentle.",
       curLv:0,levels:[
         {n:"Full Release Sequence",pose:"neck-tilt",d:"Neck tilts, trap rolls, and chest opener combined",reps:"2 min",rir:"RIR 4+",
          cues:["Neck tilts: ear to shoulder, hold 15s each side","Trap rolls: slow shoulder circles forward and back","Chest opener: interlace hands behind back, gently lift","10 slow deep breaths to close — let everything settle"]}
       ]},
    ]
  },
  5: {
    name:"Push B", day:"Friday", icon:"💥", col:"#f472b6", grad:["#db2777","#9d174d"],
    tip:"Handstand push-up day. Builds directly on Wednesday's balance work — now you're adding a press on top of the hold.",
    exercises:[
      {id:"f_w1",sec:"WARMUP",name:"Wrist Warm-up Sequence",sets:1,rest:0,muscle:"Wrists · Forearms",
       rirNote:"Prep work — never pushed into discomfort.",
       curLv:0,levels:[
         {n:"Basic wrist circles",pose:"circle-arms",d:"Unloaded circles and prayer stretches",reps:"2 min continuous",rir:"RIR 4+",
          cues:["Wrist circles: 10 each direction both hands","Prayer hands: press palms together and hold 20s","Reverse prayer: backs of hands pressed together, push down","Quadruped rocks: weight on hands, rock forward and back gently","Loaded extension: lean into palms on floor — 20s hold"]},
         {n:"Full loaded wrist sequence",pose:"circle-arms",d:"Same sequence with longer loaded holds",reps:"2 min continuous",rir:"RIR 4+",
          cues:["Same full circuit, holding each loaded position for 30s","Only use this once the basic version feels completely comfortable","This is the deepest wrist prep before heavy pressing work","Back off immediately if any position causes sharp pain"]}
       ]},
      {id:"f_w2",sec:"WARMUP",name:"Scapular Push-ups + Shoulder Circles",sets:2,rest:20,muscle:"Serratus · Shoulder Capsule",
       rirNote:"Activation combo — keep it light.",
       curLv:0,levels:[
         {n:"Standard Warm-up",pose:"scap-pushup",d:"Scapular push-ups followed by arm circles",reps:"10 reps + 10 circles",rir:"RIR 4+",
          cues:["Scapular push-ups first: protract and retract — arms straight","Immediately follow with 10 large arm circles each direction","Perfect combination to pre-activate pushing muscles","Starts the neural drive for the skill work ahead"]}
       ]},
      {id:"f_w3",sec:"WARMUP",name:"Band Pull-Aparts",sets:2,rest:20,muscle:"Rear Delts · External Rotators",
       rirNote:"Balances push-day forces before heavy pressing begins — keep it light.",
       curLv:0,levels:[
         {n:"Pull-Aparts",pose:"band-pull",d:"Band held at shoulder height, pulled apart",reps:"15 reps",rir:"RIR 4+",
          cues:["Shoulder-height pull-aparts — critical on push-heavy days","Balances the push forces before heavy pressing begins","Hold the end position for 1 second each rep","Never skip on push days — this is injury prevention"]},
         {n:"Face Pulls",pose:"band-pull",d:"Elbow-high band pull toward the face",reps:"12 reps",rir:"RIR 4+",
          cues:["Anchor the band at face height instead of shoulder height","Pull leading with the elbows, finishing above wrist level","Hits the rear delts and rotator cuff a bit more directly","A good substitute once pull-aparts feel too easy"]}
       ]},
      {id:"f_s1",sec:"SKILLS",name:"Handstand Push-up",sets:4,rest:90,muscle:"Shoulders · Triceps · Core · Wrists",
       rirNote:"High-fatigue vertical pressing sequence — keep reps pristine.",
       curLv:1,levels:[
         {n:"Wall Handstand Holds",pose:"handstand",d:"Pure holds, no pressing component yet",reps:"20–30 sec",rir:"2s Reserve",
          cues:["Kick up to a wall handstand and focus purely on the hold","Squeeze glutes, core, and legs — actively push the floor away","Build toward consistent 20–30 second holds before adding presses","This is the foundation every later level depends on"]},
         {n:"Wall HS + Pike Push-ups",pose:"handstand-pushup",d:"Holds combined with elevated pike push-up attempts",reps:"5–8 reps",rir:"RIR 2",
          cues:["Sets 1–2: Wall handstand holds — quality focus","Sets 3–4: Attempt wall handstand push-ups or elevated pike push-ups","In the handstand: squeeze everything, push floor away","In the pike/HSPU: head goes FORWARD of hands at the bottom","This is your direct skill-to-strength bridge for overhead pressing"]},
         {n:"Wall HSPU (partial range)",pose:"handstand-pushup",d:"Short-range presses from the top of a wall handstand",reps:"4–6 reps",rir:"RIR 2",
          cues:["Kick up to a wall handstand, lower only a small distance","Press back up through the same short range","Builds pressing strength before chasing full range","Increase the range gradually session to session"]},
         {n:"Wall HSPU (full range)",pose:"handstand-pushup",d:"Full-range handstand push-up, head to floor",reps:"2–4 reps",rir:"RIR 2",
          cues:["Lower all the way until the head lightly touches the floor","Press back up by pushing the floor away, not just bending elbows","A folded towel under the head is a smart safety addition","Expect far fewer reps than the partial-range version"]},
         {n:"Freestanding HSPU",pose:"handstand-pushup",d:"Full handstand push-up with no wall support",reps:"1–2 reps",rir:"RIR 2–3",
          cues:["Requires a rock-solid freestanding handstand hold first","The descent is much harder to control without a wall guide","Practise near a wall as a safety backstop, not a crutch","An elite-level goal worth years of patient progression"]}
       ]},
      {id:"f_s2",sec:"SKILLS",name:"Handstand Push-up Negatives",sets:3,rest:90,muscle:"Shoulders · Triceps · Core",
       rirNote:"Stop the descent the moment control is lost — this is not a movement to grind through.",
       curLv:0,levels:[
         {n:"Wall Pike Negative",pose:"pushup-pike",d:"Lower from an elevated pike position toward the floor",reps:"4–5 reps",rir:"RIR 1",
          cues:["Feet elevated on a chair, hands on the floor below","Lower the head toward the floor over a slow 3–4 second count","Press back up, or reset with the feet if control is lost","Builds the eccentric strength behind every handstand push-up"]},
         {n:"Wall HSPU Negative (partial)",pose:"handstand-pushup",d:"From a wall handstand, lower a short distance under control",reps:"3–4 reps",rir:"RIR 1–2",
          cues:["Kick up to a wall handstand, lower a small distance, then reset","Keep the elbows tracking forward, not flaring out to the sides","A folded towel under the head is a smart safety addition","Increase the lowering distance gradually over weeks"]},
         {n:"Wall HSPU Negative (full)",pose:"handstand-pushup",d:"Full-range lower from a wall handstand to the floor",reps:"2–3 reps",rir:"RIR 2",
          cues:["Lower all the way until the head lightly touches the floor","This is a serious eccentric loading stimulus for the shoulders","Press back up if you can, or carefully roll out if not","Only attempt once partial negatives feel completely controlled"]}
       ]},
      {id:"f_v1",sec:"VOLUME",name:"Pike Push-ups",sets:3,rest:75,muscle:"Anterior Deltoid · Triceps",
       rirNote:"The foundational easier regression that builds the base under your handstand push-up work.",
       curLv:0,levels:[
         {n:"Pike Push-ups",pose:"pushup-pike",d:"Hips high in an inverted V, pressing toward the floor",reps:"8–10 reps",rir:"RIR 1",
          cues:["Hips HIGH — form a sharp inverted V","Lower head FORWARD of hands — not straight down","This is your handstand push-up prep movement","Arms track slightly forward during the press","The closer your hands are to your feet, the harder"]},
         {n:"Elevated Pike PU",pose:"elevated-pike",d:"Feet raised on a chair for a more vertical pressing angle",reps:"6–8 reps",rir:"RIR 1–2",
          cues:["Feet up on a chair, hands on the floor below","This pushes the angle much closer to a true handstand","Head still travels forward of the hands at the bottom","Expect this to feel significantly harder than floor pike push-ups"]},
         {n:"Wall HSPU (feet on wall)",pose:"pike-wall",d:"Feet against a wall, body near-vertical",reps:"5–7 reps",rir:"RIR 2",
          cues:["Walk feet up the wall until the body is close to vertical","Hands stay a consistent distance from the wall — don't creep them in","Lower under control, head moving toward the floor","Press back up through the whole hand, not just the fingertips"]},
         {n:"Wall HSPU (head to floor)",pose:"handstand-pushup",d:"Full handstand push-up, facing the wall",reps:"3–5 reps",rir:"RIR 2",
          cues:["Kick up into a wall-facing handstand, hands 10–15cm from the wall","Lower slowly until the head lightly taps the floor","Press back up by pushing the floor away, not just bending elbows","A folded towel or pad under the head is a smart safety addition"]},
         {n:"Freestanding HSPU",pose:"handstand-pushup",d:"Full handstand push-up with no wall support",reps:"1–3 reps",rir:"RIR 2–3",
          cues:["Years of wall HSPU and balance work should come before this","Establish a rock-solid freestanding handstand hold first","The descent is harder to control without a wall as a guide","Practise near a wall as a safety backstop, not a crutch"]}
       ]},
      {id:"f_v2",sec:"VOLUME",name:"Wall Handstand Hold",sets:3,rest:60,muscle:"Shoulders · Core · Wrists",
       rirNote:"Supporting volume for the pressing skill above — these holds build shoulder endurance, not a new max time.",
       curLv:1,levels:[
         {n:"Pike Against Wall",pose:"pike-wall",d:"Feet on the wall, hips bent, hands on the floor",reps:"20–30 sec",rir:"RIR 1",
          cues:["Same pike position as Wednesday's volume work","Use this to keep shoulder volume up without extra fall risk","Push the floor away through straight arms the whole time","A safe place to accumulate time when fatigue is high"]},
         {n:"Wall Handstand Hold",pose:"handstand",d:"Full handstand facing the wall",reps:"15–25 sec",rir:"RIR 1–2",
          cues:["Face the wall, hands close to the base, squeeze everything tight","This is volume, not a max attempt — several solid holds beat one shaky long one","Push through the whole hand, not just the fingertips","Builds the base that today's pressing work draws from"]}
       ]},
      {id:"f_a1",sec:"ACCESS",name:"Dips",sets:3,rest:90,muscle:"Lower Chest · Triceps · Anterior Deltoid",
       rirNote:"Basic pressing strength — one extra mental note vs Tuesday, this is your second dip session of the week.",
       curLv:1,levels:[
         {n:"Bench Dips",pose:"bench-dip",d:"Hands behind on a bench, feet on the floor",reps:"10–12 reps",rir:"RIR 1",
          cues:["Hands behind you on a bench, feet out in front on the floor","Lower by bending the elbows straight back, not flaring wide","Stop when upper arms reach roughly parallel to the floor","A good fallback if the bars feel demanding today"]},
         {n:"Parallel Bar Dips",pose:"dip",d:"Standard bar dips — your current working level",reps:"6–8 reps",rir:"RIR 1–2",
          cues:["Lean forward slightly for chest, stay upright for triceps","Shoulder caps BELOW elbows at the bottom","Compare to Tuesday — look for consistency, not a new max","Full lockout at top = complete tricep squeeze"]},
         {n:"Deep Dips",pose:"dip",d:"Same bars, increased range of motion at the bottom",reps:"5–7 reps",rir:"RIR 2",
          cues:["Only add depth once standard dips feel completely controlled","Shoulders travel below elbow height — go gradually, not all at once","Stop descending the moment you feel any anterior shoulder pinch","Depth earns strength only when it stays pain-free"]},
         {n:"Straight Bar Dips",pose:"dip",d:"Single straight bar instead of parallel bars",reps:"5–7 reps",rir:"RIR 2",
          cues:["Hands gripping one straight bar rather than two parallel ones","Grip width is fixed by the bar — adjust body lean accordingly","Slightly more wrist and forearm demand than parallel bars","Same depth and lockout standards apply"]},
         {n:"L-Sit Dips",pose:"lsit-dip",d:"Dips performed with legs held horizontal throughout",reps:"3–5 reps",rir:"RIR 2",
          cues:["Lock the L-sit position before starting the dip, not mid-rep","Hips stay lifted and legs straight for the entire set","This combines compression strength with pressing strength","Expect noticeably fewer reps than standard dips"]},
         {n:"Weighted (16+)",pose:"dip",d:"Added load via a dip belt",reps:"4–6 reps",rir:"RIR 2",
          cues:["Wait until age 16 — shoulder joints are still maturing before that","Start with the smallest available weight increment","Depth and lockout standards don't change just because weight is added","Drop back to bodyweight immediately if form degrades"]},
         {n:"Ring Dips",pose:"dip",d:"Performed on gymnastic rings for added instability",reps:"4–6 reps",rir:"RIR 2–3",
          cues:["Rings move — expect a stability challenge on top of the strength one","Turn the rings out slightly at the bottom to protect the shoulders","Control the wobble rather than fighting it stiffly","Build ring support holds before attempting ring dip reps"]},
         {n:"Korean Dips",pose:"dip",d:"Hands set behind the body on a single bar, deep range",reps:"3–5 reps",rir:"RIR 2–3",
          cues:["Hands grip a bar set behind the body, not beside it","This is an advanced shoulder and chest stretch under load","Only attempt with excellent shoulder mobility already established","Go slowly — this is the deepest range any dip variation uses"]}
       ]},
      {id:"f_a2",sec:"ACCESS",name:"Diamond Push-ups",sets:2,rest:60,muscle:"Triceps · Inner Chest",
       rirNote:"Basic pressing strength — final volume of the week for tricep adaptation.",
       curLv:0,levels:[
         {n:"Diamond Push-ups",pose:"pushup",d:"Hands together under the chest",reps:"10–12 reps",rir:"RIR 1",
          cues:["Hands in diamond shape on the floor","Elbows BACK — never flare outward","Full lockout at top = maximum tricep activation","Builds the lock-out strength critical for advanced pushing skills"]},
         {n:"Decline Diamonds",pose:"pushup-decline",d:"Feet elevated, diamond hand position",reps:"8–10 reps",rir:"RIR 1",
          cues:["Feet up on a chair, hands together in the diamond shape","Adds shoulder demand on top of the tricep focus","Elbows still track back, never flaring wide","A solid final-set finisher once flat diamonds feel easy"]},
         {n:"Ring Tricep Extensions",pose:"ring-tricep",d:"Standing or kneeling extensions on gymnastic rings",reps:"8–10 reps",rir:"RIR 1–2",
          cues:["Lean forward into the rings with arms extended overhead","Bend only at the elbow, keeping the upper arm still","Adjust the lean angle to manage difficulty","Isolates the triceps even more directly than diamonds"]}
       ]},
      {id:"f_c1",sec:"COOLDOWN",name:"Chest + Anterior Shoulder Full Release",sets:1,rest:15,muscle:"Pectorals · Anterior Deltoid",
       rirNote:"Full release after a heavy pressing day — ease in, never force.",
       curLv:0,levels:[
         {n:"Full chest + shoulder release",pose:"stretch-standing",d:"Doorframe, overhead, and child's pose sequence",reps:"45 sec each",rir:"RIR 4+",
          cues:["Doorframe chest stretch: forearm vertical, step through and rotate","Overhead shoulder: arm straight up, gentle backward pressure","Child's pose with arms extended: full lat and shoulder decompression","Your pressing muscles worked hard — give them a full release"]}
       ]},
      {id:"f_c2",sec:"COOLDOWN",name:"Wrist + Forearm Full Release",sets:1,rest:0,muscle:"Wrists · Forearm Flexors/Extensors",
       rirNote:"Wrists worked hard with handstand prep — give them genuine care.",
       curLv:0,levels:[
         {n:"Wrist Release",pose:"stretch-arm",d:"Circles, prayer holds, and gentle rocking",reps:"2 min",rir:"RIR 4+",
          cues:["Circles: 10 each direction — feel any tight spots","Prayer and reverse prayer holds","Quadruped rocks: weight through hands slowly","Wrists worked hard with handstand prep — give them this care","Shake hands out to finish every session"]},
         {n:"Loaded Extension Prep",pose:"stretch-arm",d:"Leaning into extended palms on the floor",reps:"90 sec",rir:"RIR 4+",
          cues:["Lean body weight gently into flat palms, fingers pointing back","Only add this once the basic release feels completely comfortable","Builds extension range for future handstand and planche work","Stop immediately at any sharp wrist sensation"]}
       ]},
      {id:"f_c3",sec:"COOLDOWN",name:"Full Upper Body Stretch Flow",sets:1,rest:0,muscle:"Full Upper Body",
       rirNote:"Closing sequence for a heavy push day — unhurried.",
       curLv:0,levels:[
         {n:"Upper body flow",pose:"stretch-standing",d:"Lat, shoulder, tricep, and neck stretches in sequence",reps:"3 min continuous",rir:"RIR 4+",
          cues:["Lat stretch: arm overhead, lean to opposite side","Cross-body shoulder: pull arm across chest 30s each","Tricep stretch: elbow behind head 30s each","Neck tilts: ear to shoulder each side","10 deep breaths and shake everything out — session closed"]}
       ]},
    ]
  },
  6: {
    name:"Legs", day:"Saturday", icon:"🦵", col:"#34d399", grad:["#059669","#065f46"],
    tip:"Pistol squat day. Single-leg strength and balance combined — every rep trains control as much as power.",
    exercises:[
      {id:"s_w1",sec:"WARMUP",name:"Leg Swings + Hip Circles",sets:1,rest:0,muscle:"Hip Mobility · Hamstrings",
       rirNote:"Joint lubrication only — never forced.",
       curLv:0,levels:[
         {n:"Leg swings + hip circles",pose:"leg-swing",d:"Controlled swings plus hip circles, holding a wall for balance",reps:"10 each direction",rir:"RIR 4+",
          cues:["Forward/backward leg swings: hold a wall for balance — big controlled range","Side-to-side swings: same — controlled, not ballistic","Hip circles: large circles both directions","Lubricates the hip joint before heavy unilateral loading"]}
       ]},
      {id:"s_w2",sec:"WARMUP",name:"Bodyweight Squats",sets:2,rest:20,muscle:"Quads · Glutes · Hip Flexors",
       rirNote:"Warm-up only — not a working set.",
       curLv:0,levels:[
         {n:"Bodyweight Squats",pose:"squat",d:"Standard squats to prime the pattern before loading",reps:"15 reps",rir:"RIR 4+",
          cues:["Feet shoulder-width, toes slightly out","Hips break PARALLEL — go deep if mobility allows","Knees track over toes throughout","These are warm-up only — not working sets"]}
       ]},
      {id:"s_w3",sec:"WARMUP",name:"Cossack Squat Warm-up",sets:1,rest:20,muscle:"Adductors · Hip Flexors · Ankles",
       rirNote:"Mobility prep — depth builds gradually, never forced.",
       curLv:0,levels:[
         {n:"Partial warm-up Cossack",pose:"cossack-squat",d:"Shallow side-to-side shifting to open the hips",reps:"8 reps each side",rir:"RIR 4+",
          cues:["Wide stance — shift side to side at comfortable depth","Gradually increase depth each rep","Opens the hips and ankles before working sets","Hold a water bottle as counterweight if balance is tricky"]}
       ]},
      {id:"s_s1",sec:"SKILLS",name:"Pistol Squat",sets:4,rest:90,muscle:"Quads · Glutes · Hamstrings · Balance · Proprioception",
       rirNote:"Unilateral balance is highly complex — stop before coordination breaks down.",
       curLv:0,levels:[
         {n:"Assisted Pistol",pose:"assisted-pistol",d:"Holding a door handle for full balance support",reps:"5–8 reps per leg",rir:"RIR 1",
          cues:["Pistol attempts: hold a door handle, extend one leg forward, squat as deep as possible","Use assistance freely — every attempt builds the motor pattern","Strength comes from practice — not from ego","Go as deep as control allows, no deeper"]},
         {n:"Counterweight Pistol",pose:"pistol-squat",d:"Holding a weight forward to shift the center of gravity",reps:"4–6 reps per leg",rir:"RIR 1–2",
          cues:["Hold a light weight out in front to counterbalance the squat","This makes the bottom position easier to reach without support","Keep the weight steady — don't let it swing","A useful bridge once assisted reps feel solid"]},
         {n:"Box Pistol",pose:"pistol-squat",d:"Squatting down to a box or step for a controlled depth",reps:"4–6 reps per leg",rir:"RIR 1–2",
          cues:["Squat down until lightly touching a box or step behind you","Stand back up without using the box for support","Lower the box height gradually as strength improves","Removes the hand-support crutch while keeping depth manageable"]},
         {n:"Full Pistol Squat",pose:"pistol-squat",d:"Unassisted single-leg squat to full depth",reps:"3–5 reps per leg",rir:"2s Reserve",
          cues:["No support — balance and strength entirely on one leg","Extend the non-working leg forward and keep it off the floor","Control the descent all the way to full depth","LONG TERM GOAL: full unassisted pistol squat on each leg"]},
         {n:"Weighted Pistol",pose:"pistol-squat",d:"Holding extra load while performing a full pistol",reps:"2–4 reps per leg",rir:"2–3s Reserve",
          cues:["Only attempt once bodyweight pistols feel completely controlled","Hold the weight close to the chest to avoid throwing off balance","Start with a very light load — this is still a balance-heavy movement","Reduce load immediately if depth or control suffers"]},
         {n:"Dragon Squat",pose:"dragon-squat",d:"An advanced single-leg squat with the rear leg crossed behind",reps:"2–3 reps per leg",rir:"3s Reserve",
          cues:["The non-working leg crosses behind and to the side, not straight forward","This shortens the lever but adds a significant balance challenge","Years of pistol squat practice should come before attempting this","Move slowly — the unusual leg position takes time to learn"]}
       ]},
      {id:"s_s2",sec:"SKILLS",name:"Pistol Squat Negatives",sets:3,rest:90,muscle:"Quads · Glutes · Hamstrings · Balance",
       rirNote:"Stop the descent the moment the knee wobbles or balance is lost — this trains control, not depth at any cost.",
       curLv:0,levels:[
         {n:"Box Pistol Negative",pose:"pistol-squat",d:"Lower slowly onto a box on one leg, using light hand support",reps:"4–5 reps per leg",rir:"RIR 1",
          cues:["Stand on one leg in front of a box or step, light hand support allowed","Lower as slowly as possible until lightly touching the box","Stand back up however you need to — the lower is what matters today","Builds the single-leg control a full pistol squat depends on"]},
         {n:"Assisted Pistol Negative",pose:"assisted-pistol",d:"Slow unassisted-depth lower, holding a support for balance only",reps:"3–4 reps per leg",rir:"RIR 1–2",
          cues:["Hold a door handle lightly — for balance only, not for pulling yourself up","Lower over a controlled 4–5 second count to full depth","Use both legs or the support to stand back up if needed","A direct bridge between assisted and full pistol squats"]},
         {n:"Full Pistol Negative",pose:"pistol-squat",d:"Slow unassisted lower to full depth, no support",reps:"2–3 reps per leg",rir:"RIR 2",
          cues:["No support at all — balance and control entirely on one leg","Lower as slowly as you can manage to full depth","Use a hand on the floor to help stand back up, that's fine","Once this feels controlled, full pistol squats are very close"]}
       ]},
      {id:"s_v1",sec:"VOLUME",name:"Bulgarian Split Squats",sets:4,rest:120,muscle:"Quads · Glutes · Hamstrings",
       rirNote:"Easier variation of the pistol squat — high structural demand on knee tracking, so keep form flawless.",
       curLv:1,levels:[
         {n:"Bodyweight Squats",pose:"squat",d:"Two-legged squats — the foundational pattern",reps:"15–20 reps",rir:"RIR 1",
          cues:["Feet shoulder-width, squat to at least parallel","Knees track over the toes throughout","Use this as a regression on a day when balance feels off","Master this depth and control before adding the split stance"]},
         {n:"Bulgarian Split Squats",pose:"split-squat",d:"Back foot elevated — your current working level",reps:"8–12 reps per leg",rir:"RIR 1–2",
          cues:["Back foot elevated on chair or bench","Drop back knee CLOSE to the floor","Front shin stays as VERTICAL as possible","~85% of bodyweight is on the front leg alone","Build the form — weight comes later at age 16+"]},
         {n:"Cossack Squats",pose:"cossack-squat",d:"Wide-stance lateral squat shifting side to side",reps:"8–10 reps per side",rir:"RIR 2",
          cues:["Wide stance, shift weight fully onto one bent leg","The other leg extends straight out to the side","Go as deep as mobility allows, building gradually","A lateral-plane complement to the forward-back split squat"]},
         {n:"Shrimp Squats",pose:"shrimp-squat",d:"Holding the back foot, no support, full unilateral squat",reps:"5–8 reps per leg",rir:"RIR 2",
          cues:["Hold the back foot up behind you with one hand","No support from a chair or bench — balance is all you","Squat down on the front leg until the back knee nearly touches the floor","A significant jump in difficulty from Bulgarian split squats"]},
         {n:"Assisted Pistol",pose:"assisted-pistol",d:"Single-leg squat using a door handle for support",reps:"5–8 reps per leg",rir:"RIR 1–2",
          cues:["Hold a door handle or pole for balance support","Extend the non-working leg straight out in front","Squat as deep as control allows on the supporting leg","Use freely — this builds the single-leg motor pattern safely"]},
         {n:"Full Pistol Squat",pose:"pistol-squat",d:"Unassisted single-leg squat to full depth",reps:"3–5 reps per leg",rir:"RIR 2",
          cues:["No support — balance and strength entirely on one leg","Extend the non-working leg forward and keep it off the floor","Control the descent all the way down","The natural endpoint of the unilateral leg progression"]},
         {n:"Weighted Pistol",pose:"pistol-squat",d:"Adding load to a full, unassisted pistol squat",reps:"3–5 reps per leg",rir:"RIR 2–3",
          cues:["Only once bodyweight pistols are completely controlled","Hold light weight close to the chest, not out in front","Reduce load immediately if depth or balance suffers","An advanced strength goal beyond the base program"]}
       ]},
      {id:"s_v2",sec:"VOLUME",name:"Cossack Squats",sets:3,rest:90,muscle:"Adductors · Hip Flexors · Quads · Ankles",
       rirNote:"Easier variation supporting the pistol squat — limited by adductor and ankle mobility, so forcing RIR 0 risks pulled muscles.",
       curLv:0,levels:[
         {n:"Partial Cossack",pose:"cossack-squat",d:"Shallow depth, building range gradually",reps:"10 reps per side",rir:"RIR 1",
          cues:["Wide stance — shift weight fully to one side","Other leg extends STRAIGHT out to the side","Use a water bottle for balance — no ego here","Stay above your deepest comfortable range for now"]},
         {n:"Full Depth Cossack",pose:"cossack-squat",d:"Maximum comfortable depth on each side",reps:"8–10 reps per side",rir:"RIR 1–2",
          cues:["Go as deep as your mobility allows — build it gradually","Lateral hip strength carries over to every lower body skill","Keep the extended leg's toes pointing up, not collapsing inward","Control the shift back to center just as carefully as the descent"]},
         {n:"Cossack + Leg Lift",pose:"cossack-squat",d:"Lifting the straight leg before shifting back to center",reps:"6–8 reps per side",rir:"RIR 2",
          cues:["From the bottom position, lift the straight leg slightly before shifting back","This adds a hip-flexor and balance challenge to the base movement","Keep the lift small and controlled, not a kick","Only add this once full-depth Cossacks feel completely stable"]},
         {n:"Weighted Cossack",pose:"cossack-squat",d:"Holding extra load while performing the squat",reps:"6–8 reps per side",rir:"RIR 2",
          cues:["Hold a light weight at the chest, not out to the sides","Added load increases ankle and adductor demand significantly","Reduce depth slightly if weight starts to pull you off balance","A solid long-term goal once bodyweight depth is excellent"]}
       ]},
      {id:"s_a1",sec:"ACCESS",name:"Single-Leg Romanian Deadlift",sets:3,rest:90,muscle:"Hamstrings · Glutes · Lower Back · Balance",
       rirNote:"Basic posterior-chain training — hinge pattern relies on balance, so break the set when ankle stabilizers give out.",
       curLv:2,levels:[
         {n:"Glute Bridge",pose:"glute-bridge",d:"Two-leg hip hinge lying on the back",reps:"15 reps",rir:"RIR 1",
          cues:["Lie on your back, feet flat, knees bent","Drive hips up by squeezing the glutes, not arching the lower back","Hold briefly at the top before lowering","Builds the hip-hinge pattern before standing balance is added"]},
         {n:"SL Glute Bridge",pose:"glute-bridge",d:"Single-leg version of the same hip hinge",reps:"10–12 reps per leg",rir:"RIR 1",
          cues:["Same bridge position, one foot lifted off the floor","Drive through the planted heel, keeping hips level","Resist letting the hips rotate toward the lifted side","A good bridge between two-leg bridges and standing RDLs"]},
         {n:"SL RDL",pose:"rdl",d:"Standing single-leg Romanian deadlift — current level",reps:"10 reps per leg",rir:"RIR 1–2",
          cues:["Stand on one foot — hinge at the HIP, not the waist","Other leg extends behind as natural counterbalance","Keep back FLAT — no rounding at any point","Hold water bottles in each hand for balance if needed","Feel the hamstring STRETCH of the standing leg at the bottom"]},
         {n:"Nordic Curl",pose:"nordic-curl",d:"Kneeling hamstring curl lowering the torso forward",reps:"5–6 reps",rir:"RIR 2",
          cues:["Kneel with ankles anchored or held by a partner","Lower the torso forward as slowly as the hamstrings allow","Use hands to catch yourself once control is lost, that's fine early on","An intense eccentric hamstring challenge — progress patiently"]},
         {n:"Natural Leg Curl",pose:"nordic-curl",d:"Advanced hamstring curl using only bodyweight control",reps:"3–5 reps",rir:"RIR 2–3",
          cues:["A more advanced version of the Nordic curl requiring full-range control","Both the lowering and the curl back up are done without hand support","Years of Nordic curl practice should come before attempting the full curl back","Respect how demanding this is on the hamstring tendons"]}
       ]},
      {id:"s_a2",sec:"ACCESS",name:"Calf Raises",sets:3,rest:60,muscle:"Gastrocnemius · Soleus",
       rirNote:"Completely safe to push to a deep metabolic burn — a low-risk joint regardless of level.",
       curLv:1,levels:[
         {n:"Seated Calf Raises",pose:"seated-calf-raise",d:"Seated position — isolates the soleus with less load",reps:"15–20 reps",rir:"RIR 0–1",
          cues:["Sit with feet flat, knees bent at roughly 90°","Rise up onto the toes, hold briefly, lower with control","Less gastrocnemius involvement than standing — good early option","Still safe to push to a genuine burn"]},
         {n:"Standing Calf Raises",pose:"calf-raise",d:"Standing on a step or ledge — full range, current level",reps:"20 reps",rir:"RIR 0–1",
          cues:["Use a step or ledge for FULL range of motion","Hold the stretch at the bottom for 1 full second","Rise as HIGH as possible — maximum plantar flexion","Both rise and descent are fully controlled","Single-leg version is 2× more effective when you are ready"]},
         {n:"Single-Leg Raises",pose:"calf-raise",d:"One foot at a time — doubles the load per calf",reps:"12–15 reps per leg",rir:"RIR 1",
          cues:["Same ledge setup, but balance and push through one foot at a time","Hold something light for balance if needed, not for assistance","Expect noticeably more burn at the same rep count","A great safe option to push deep into fatigue"]},
         {n:"Weighted SL Raises",pose:"calf-raise",d:"Single-leg raises with added load",reps:"10–12 reps per leg",rir:"RIR 1",
          cues:["Hold a light weight or wear a loaded backpack","Same full range and 1-second stretch at the bottom","Completely safe to push hard here — this is a low-risk joint","A strong long-term option for continued calf development"]}
       ]},
      {id:"s_c1",sec:"COOLDOWN",name:"Hip Flexor + Quad Stretch",sets:1,rest:15,muscle:"Hip Flexors · Quads · Psoas",
       rirNote:"Cooldown — ease into range, never force.",
       curLv:0,levels:[
         {n:"Kneeling Lunge",pose:"stretch-kneeling",d:"Half-kneeling stretch, hips pressed forward",reps:"45 sec each side",rir:"RIR 4+",
          cues:["Kneeling lunge: push hips FORWARD and down","Raise same-side arm overhead to deepen the stretch","For quad: gently pull back foot toward glutes","Your hip flexors worked hard during pistol attempts — they need this release"]},
         {n:"Couch Stretch",pose:"stretch-kneeling",d:"Back foot elevated behind you on a chair",reps:"45 sec each side",rir:"RIR 4+",
          cues:["Back foot elevated behind you on a chair or couch","Keep the front shin vertical and hips squared forward","A much deeper hip flexor and quad stretch than the kneeling version","Ease in gradually — this position is intense after leg day"]}
       ]},
      {id:"s_c2",sec:"COOLDOWN",name:"Hamstring + Adductor Stretch",sets:1,rest:15,muscle:"Hamstrings · Adductors",
       rirNote:"These muscles worked hard in Cossacks and RDLs — release gently.",
       curLv:0,levels:[
         {n:"Static stretches",pose:"stretch-seated",d:"Seated hamstring, adductor, and butterfly stretches",reps:"45 sec each",rir:"RIR 4+",
          cues:["Seated hamstring: one leg straight, lean toward foot","Adductor: straddle position, lean forward to the middle","Butterfly: soles of feet together, gentle forward lean","These were stretched hard in Cossacks and RDLs — release them"]},
         {n:"PNF Stretching",pose:"stretch-seated",d:"Contract-relax method for a deeper neurological release",reps:"30 sec each + contract",rir:"RIR 4+",
          cues:["Gently contract the stretched muscle for 5 seconds, then relax into a deeper stretch","Repeat 2–3 times per muscle group","This reaches further than static holding alone","Only use once static stretching feels completely comfortable"]}
       ]},
      {id:"s_c3",sec:"COOLDOWN",name:"Ankle Circles + Full Leg Flush",sets:1,rest:0,muscle:"Ankles · Calves · Full Leg",
       rirNote:"End-of-week flush — gentle and unhurried.",
       curLv:0,levels:[
         {n:"Ankle mobility + stretches",pose:"circle-arms",d:"Ankle circles, calf stretch, and quad stretch combined",reps:"2 min",rir:"RIR 4+",
          cues:["Ankle circles: 10 each direction each foot","Calf stretch: step back, press heel down firmly","Standing quad stretch 15s each side","Shake legs out — let circulation return","Close with 5 deep breaths — training is done for the week"]}
       ]},
    ]
  }
};

const rirColor = (r) => {
  if(!r) return "#94a3b8";
  if(r.includes("4+")) return "#94a3b8";
  if(r.includes("RIR 2–3")) return "#34d399";
  if(r.includes("0")) return "#f87171";
  if(r==="RIR 1") return "#fb923c";
  if(r.includes("RIR 1–2")) return "#fbbf24";
  if(r==="RIR 2") return "#60a5fa";
  if(r==="RIR 3") return "#34d399";
  return "#c084fc";
};

// Body-region pictograms — head point + limb segments grouped into arms/torso/legs
// on a 64x64 grid, plus an optional static bar/floor/extra reference line and a
// looping animation class. Worked muscle groups render in red, the rest in neutral gray.
const POSES = {
  "hang":                { head:[32,16], bar:[16,7,48,7],    arms:[[22,7,29,20],[42,7,35,20]], torso:[[32,20,32,44]], legs:[[32,44,27,60],[32,44,37,60]], anim:"sway" },
  "l-hang":              { head:[32,16], bar:[16,7,48,7],    arms:[[22,7,29,20],[42,7,35,20]], torso:[[32,20,32,38]], legs:[[32,38,48,34],[32,38,52,40]], anim:"hold" },
  "single-arm-hang":     { head:[30,16], bar:[16,7,48,7],    arms:[[30,7,32,20],[34,22,38,30]], torso:[[32,20,32,44]], legs:[[32,44,27,60],[32,44,37,60]], anim:"sway" },
  "scap-hang":           { head:[32,17], bar:[16,7,48,7],    arms:[[22,7,29,21],[42,7,35,21]], torso:[[32,21,32,42]], legs:[[32,42,27,58],[32,42,37,58]], anim:"hold" },
  "circle-arms":         { head:[32,12], torso:[[32,16,32,40]], legs:[[32,40,26,60],[32,40,38,60]], arms:[[32,20,14,14],[32,20,50,14]], anim:"sway" },
  "band-pull":           { head:[32,12], torso:[[32,16,32,40]], legs:[[32,40,26,60],[32,40,38,60]], arms:[[32,22,16,22],[32,22,48,22]], anim:"hold" },
  "pullup":              { head:[32,14], bar:[16,7,48,7],    arms:[[22,7,30,16],[42,7,34,16]], torso:[[32,18,32,40]], legs:[[32,40,27,58],[32,40,37,58]], anim:"rep-up" },
  "pullup-negative":     { head:[32,20], bar:[16,7,48,7],    arms:[[22,7,28,22],[42,7,36,22]], torso:[[32,24,32,42]], legs:[[32,42,27,58],[32,42,37,58]], anim:"rep-up" },
  "band-assisted-pullup":{ head:[32,14], bar:[16,7,48,7], extra:[27,52,37,52], arms:[[22,7,30,16],[42,7,34,16]], torso:[[32,18,32,40]], legs:[[32,40,27,58],[32,40,37,58]], anim:"rep-up" },
  "weighted-pullup":     { head:[32,14], bar:[16,7,48,7], extra:[28,44,36,44], arms:[[22,7,30,16],[42,7,34,16]], torso:[[32,18,32,40]], legs:[[32,40,27,58],[32,40,37,58]], anim:"rep-up" },
  "lsit-pullup":         { head:[32,14], bar:[16,7,48,7],    arms:[[22,7,30,16],[42,7,34,16]], torso:[[32,18,32,34]], legs:[[32,34,50,30],[32,34,50,38]], anim:"rep-up" },
  "archer-pullup":       { head:[28,16], bar:[14,7,50,7],    arms:[[18,7,28,20],[44,7,44,22]], torso:[[28,20,30,42]], legs:[[30,42,25,58],[30,42,35,58]], anim:"rep-up" },
  "row":                 { head:[12,28], bar:[10,14,54,14],  arms:[[18,30,22,14]], torso:[[16,30,46,38]], legs:[[46,38,52,52],[46,38,58,50]], anim:"rep-up" },
  "incline-row":         { head:[14,24], bar:[10,12,40,12],  arms:[[18,26,20,12]], torso:[[18,26,40,32]], legs:[[40,32,48,46],[40,32,54,44]], anim:"rep-up" },
  "archer-row":          { head:[12,28], bar:[8,14,44,14],   arms:[[16,30,20,14],[20,30,38,18]], torso:[[16,30,44,36]], legs:[[44,36,50,50],[44,36,56,48]], anim:"rep-up" },
  "front-lever":         { head:[27,15], bar:[16,8,48,8],    arms:[[28,8,30,18]], torso:[[30,18,48,18]], legs:[[48,18,60,18]], anim:"hold" },
  "front-lever-tuck":    { head:[28,16], bar:[16,8,48,8],    arms:[[26,8,28,18]], torso:[[28,18,38,22]], legs:[[38,22,34,30]], anim:"hold" },
  "front-lever-adv-tuck":{ head:[26,16], bar:[16,8,48,8],    arms:[[24,8,26,18]], torso:[[26,18,42,20]], legs:[[42,20,40,28]], anim:"hold" },
  "front-lever-single":  { head:[26,15], bar:[14,8,46,8],    arms:[[24,8,26,18]], torso:[[26,18,46,18]], legs:[[46,18,58,18],[46,18,42,28]], anim:"hold" },
  "front-lever-straddle":{ head:[26,15], bar:[14,8,46,8],    arms:[[24,8,26,18]], torso:[[26,18,48,17]], legs:[[48,17,60,14],[48,17,60,21]], anim:"hold" },
  "front-lever-row":     { head:[22,17], bar:[14,8,50,8],    arms:[[26,8,24,20]], torso:[[24,20,46,20]], legs:[[46,20,58,18]], anim:"rep-up" },
  "dead-bug-hang":       { head:[28,17], bar:[16,8,48,8],    arms:[[26,8,28,18]], torso:[[28,18,34,24]], legs:[[34,24,30,30]], anim:"hold" },
  "scap-pushup":         { head:[14,38], floor:[6,58,58,58], torso:[[18,40,46,40]], arms:[[20,40,20,56]], legs:[[44,40,52,56]], anim:"hold" },
  "pushup":              { head:[14,38], floor:[6,58,58,58], torso:[[18,40,46,40]], arms:[[20,40,20,56]], legs:[[44,40,52,56]], anim:"rep-down" },
  "incline-pushup":      { head:[14,32], floor:[6,58,30,58], extra:[16,46,30,46], torso:[[18,34,46,42]], arms:[[20,34,20,46]], legs:[[44,42,52,56]], anim:"rep-down" },
  "pushup-decline":      { head:[14,34], floor:[36,58,58,58], extra:[44,50,56,50], torso:[[18,38,44,34]], arms:[[20,38,20,54]], legs:[[44,34,50,46]], anim:"rep-down" },
  "archer-pushup":       { head:[12,38], floor:[6,58,58,58], torso:[[16,40,44,40]], arms:[[18,40,18,56],[44,40,54,42]], legs:[[44,40,52,56]], anim:"rep-down" },
  "pushup-pike":         { head:[22,48], floor:[6,58,58,58], arms:[[24,50,30,58]], torso:[[30,46,40,30]], legs:[[40,30,52,50]], anim:"rep-down" },
  "elevated-pike":       { head:[24,42], floor:[6,58,30,58], extra:[40,50,56,50], arms:[[26,44,32,58]], torso:[[32,40,42,28]], legs:[[42,28,52,50]], anim:"rep-down" },
  "dip":                 { head:[32,34], bar:[16,22,24,22], extra:[40,22,48,22], arms:[[20,25,28,38],[44,25,36,38]], torso:[[32,38,32,48]], legs:[[32,48,26,60],[32,48,38,60]], anim:"rep-down" },
  "bench-dip":           { head:[40,30], floor:[36,52,58,52], extra:[14,40,24,40], torso:[[20,42,40,36]], arms:[[20,42,20,38]], legs:[[40,36,54,50]], anim:"rep-down" },
  "lsit-dip":            { head:[32,34], bar:[16,22,24,22], extra:[40,22,48,22], arms:[[20,25,28,38],[44,25,36,38]], torso:[[32,38,32,46]], legs:[[32,46,50,42],[32,46,50,50]], anim:"rep-down" },
  "ring-tricep":         { head:[44,20], floor:[6,58,58,58], extra:[16,10,16,30], torso:[[40,24,30,46]], arms:[[38,24,18,16]], legs:[[30,46,24,58],[30,46,38,58]], anim:"hold" },
  "planche":             { head:[14,38], floor:[6,52,58,52], arms:[[20,40,20,52]], torso:[[20,40,46,34]], legs:[[46,34,58,30]], anim:"hold" },
  "tuck-planche":        { head:[16,40], floor:[6,54,58,54], arms:[[20,42,20,54]], torso:[[20,42,32,38]], legs:[[32,38,28,30]], anim:"hold" },
  "planche-adv-tuck":    { head:[15,39], floor:[6,54,58,54], arms:[[19,41,19,54]], torso:[[19,41,38,36]], legs:[[38,36,46,30]], anim:"hold" },
  "planche-straddle":    { head:[14,38], floor:[6,52,58,52], arms:[[20,40,20,52]], torso:[[20,40,44,35]], legs:[[44,35,56,30],[44,35,56,40]], anim:"hold" },
  "planche-lean":        { head:[10,40], floor:[6,58,58,58], torso:[[14,42,44,38]], arms:[[20,42,24,58]], legs:[[42,38,52,56]], anim:"hold" },
  "tuck-planche-lean":   { head:[12,40], floor:[6,58,58,58], arms:[[20,42,22,58]], torso:[[16,42,38,36]], legs:[[38,36,32,28]], anim:"hold" },
  "wall-planche-lean":   { head:[10,40], floor:[6,58,58,58], extra:[54,30,54,58], torso:[[14,42,44,38]], arms:[[20,42,24,58]], legs:[[42,38,54,44]], anim:"hold" },
  "frog-stand":          { head:[16,36], floor:[6,56,58,56], arms:[[20,38,20,56]], torso:[[20,38,28,40]], legs:[[28,40,22,34]], anim:"hold" },
  "cat-cow":             { head:[18,40], floor:[6,58,58,58], arms:[[20,42,20,56]], torso:[[20,42,44,38]], legs:[[44,38,44,56]], anim:"sway" },
  "dead-bug":            { head:[14,46], floor:[6,56,58,56], torso:[[18,48,40,48]], arms:[[20,48,12,38]], legs:[[40,48,50,40]], anim:"hold" },
  "tuck-hollow":         { head:[18,46], floor:[6,56,58,56], torso:[[20,48,34,48]], arms:[[22,46,16,40]], legs:[[34,48,30,38]], anim:"hold" },
  "hollow":              { head:[16,48], floor:[6,58,58,58], arms:[[18,46,10,38]], torso:[[18,46,42,46]], legs:[[42,46,54,38]], anim:"hold" },
  "vsit":                { head:[16,32], floor:[6,58,58,58], arms:[[18,36,18,52]], torso:[[18,36,24,42]], legs:[[24,42,50,26]], anim:"hold" },
  "arch-hold":           { head:[16,42], floor:[6,58,58,58], arms:[[18,40,10,32]], torso:[[18,40,42,40]], legs:[[42,40,54,46]], anim:"hold" },
  "handstand":           { head:[32,52], floor:[6,58,58,58], arms:[[32,50,32,58]], torso:[[32,48,32,26]], legs:[[32,26,26,8],[32,26,38,8]], anim:"balance" },
  "pike-wall":           { head:[20,50], floor:[6,58,40,58], extra:[44,8,44,58], arms:[[22,52,26,58]], torso:[[26,46,36,30]], legs:[[36,30,44,16]], anim:"hold" },
  "handstand-pushup":    { head:[32,46], floor:[6,58,58,58], arms:[[32,44,32,58]], torso:[[32,42,32,24]], legs:[[32,24,26,8],[32,24,38,8]], anim:"rep-down" },
  "plank":               { head:[14,40], floor:[6,58,58,58], torso:[[18,42,46,42]], arms:[[20,42,20,54]], legs:[[44,42,52,54]], anim:"hold" },
  "dragon-flag":         { head:[30,14], extra:[20,16,40,16], arms:[[26,16,22,20],[34,16,38,20]], torso:[[30,18,30,46]], legs:[[30,46,30,58]], anim:"hold" },
  "lsit":                { head:[16,34], floor:[6,58,58,58], arms:[[18,38,18,54]], torso:[[18,38,26,46]], legs:[[26,46,54,40]], anim:"hold" },
  "hip-lift":            { head:[18,30], floor:[6,58,58,58], arms:[[20,34,20,50]], torso:[[20,34,26,40]], legs:[[26,40,44,42],[26,40,44,48]], anim:"hold" },
  "tuck-lsit":           { head:[16,32], floor:[6,58,58,58], arms:[[18,36,18,52]], torso:[[18,36,26,40]], legs:[[26,40,22,32]], anim:"hold" },
  "stretch-standing":    { head:[30,12], torso:[[30,16,34,40]], legs:[[34,40,28,60],[34,40,40,60]], arms:[[30,18,46,6],[32,22,24,30]], anim:"sway" },
  "stretch-arm":         { head:[32,12], torso:[[32,16,32,40]], legs:[[32,40,27,60],[32,40,37,60]], arms:[[32,22,52,24],[32,22,46,16]], anim:"hold" },
  "stretch-kneeling":    { head:[28,16], floor:[6,58,58,58], torso:[[28,20,32,40]], legs:[[32,40,40,58],[32,40,18,58]], arms:[[30,22,18,8]], anim:"sway" },
  "stretch-seated":      { head:[44,38], floor:[6,58,58,58], torso:[[42,40,30,46]], legs:[[30,46,14,50]], arms:[[40,42,18,48]], anim:"hold" },
  "stretch-rotate":      { head:[18,46], floor:[6,58,58,58], torso:[[20,46,38,46]], legs:[[38,46,44,56],[38,46,30,56]], arms:[[24,44,34,28]], anim:"sway" },
  "neck-tilt":           { head:[34,12], torso:[[32,18,32,40]], legs:[[32,40,27,60],[32,40,37,60]], arms:[[32,22,22,34],[32,22,42,34]], anim:"sway" },
  "leg-swing":           { head:[26,12], torso:[[26,16,28,40]], legs:[[28,40,30,60],[28,40,44,48]], arms:[[27,20,40,16]], anim:"sway" },
  "squat":               { head:[32,14], torso:[[32,18,32,36]], legs:[[32,36,22,42],[22,42,24,58],[32,36,42,42],[42,42,40,58]], arms:[[30,20,18,28],[34,20,46,28]], anim:"rep-squat" },
  "cossack-squat":       { head:[24,16], torso:[[24,20,26,38]], legs:[[26,38,22,56],[26,38,50,52]], arms:[[24,24,14,32],[26,24,38,30]], anim:"sway" },
  "pistol-squat":        { head:[24,14], torso:[[24,18,26,36]], legs:[[26,36,18,42],[18,42,20,58],[26,36,50,40]], arms:[[24,22,14,30],[26,22,38,18]], anim:"rep-squat" },
  "assisted-pistol":     { head:[20,16], extra:[10,18,10,50], arms:[[22,24,12,32]], torso:[[22,20,24,38]], legs:[[24,38,16,44],[16,44,18,58],[24,38,48,42]], anim:"rep-squat" },
  "dragon-squat":        { head:[24,14], torso:[[24,18,26,36]], legs:[[26,36,18,42],[18,42,20,58],[26,36,34,48]], arms:[[24,22,14,30],[26,22,38,18]], anim:"rep-squat" },
  "split-squat":         { head:[26,14], extra:[44,46,54,46], torso:[[26,18,28,36]], legs:[[28,36,18,42],[18,42,20,58],[28,36,42,46]], arms:[[26,22,16,30],[28,22,38,28]], anim:"rep-squat" },
  "shrimp-squat":        { head:[26,14], extra:[44,50,50,44], torso:[[26,18,28,36]], legs:[[28,36,18,42],[18,42,20,58],[28,36,44,50]], arms:[[26,22,16,30],[28,30,44,46]], anim:"rep-squat" },
  "rdl":                 { head:[20,24], torso:[[22,26,32,42]], legs:[[32,42,30,58],[32,42,50,38]], arms:[[24,30,18,48]], anim:"sway" },
  "glute-bridge":        { head:[14,48], floor:[6,58,58,58], torso:[[18,46,38,46]], legs:[[38,46,46,54],[46,54,38,56]], arms:[[18,46,10,54]], anim:"rep-squat" },
  "nordic-curl":         { head:[44,30], floor:[6,58,58,58], torso:[[40,32,28,44]], legs:[[28,44,28,58],[20,44,20,58]], arms:[[36,32,46,40]], anim:"rep-down" },
  "calf-raise":          { head:[32,12], torso:[[32,16,32,38]], legs:[[32,38,27,54],[32,38,37,54],[27,54,29,58],[37,54,39,58]], arms:[[32,20,24,30],[32,20,40,30]], anim:"rep-squat" },
  "seated-calf-raise":   { head:[20,20], extra:[10,28,30,28], torso:[[22,24,24,34]], legs:[[24,34,22,50],[22,50,24,56]], arms:[[22,26,14,32]], anim:"rep-squat" },
};

// Derives which body regions are doing the work from the exercise's muscle text,
// so that region renders in red ("worked") while the rest stays neutral gray.
function getHighlight(muscleStr) {
  const m = (muscleStr || "").toLowerCase();
  const legs  = /quad|glute|hamstring|calf|adductor|gastro|soleus/.test(m);
  const torso = /core|oblique|spine|psoas|hip flexor|serratus|lower back/.test(m);
  const arms  = /lat|bicep|tricep|delt|pector|chest|trap|forearm|rotator|wrist|shoulder|rhomboid/.test(m);
  return { arms: arms || (!legs && !torso), torso, legs };
}

const HILITE = "#f87171";
const NEUTRAL = "rgba(255,255,255,0.32)";
const REFLINE = "rgba(255,255,255,0.22)";

function ExerciseIcon({ pose, muscle }) {
  const p = POSES[pose] || POSES.pushup;
  const hl = getHighlight(muscle);
  const seg = (arr, on) => (arr || []).map((l, i) => (
    <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={on ? HILITE : NEUTRAL} strokeWidth={on ? 5.5 : 4.6} strokeLinecap="round" />
  ));
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={{display:"block"}}>
      {p.bar && <line x1={p.bar[0]} y1={p.bar[1]} x2={p.bar[2]} y2={p.bar[3]} stroke={REFLINE} strokeWidth="2.2" strokeLinecap="round" />}
      {p.floor && <line x1={p.floor[0]} y1={p.floor[1]} x2={p.floor[2]} y2={p.floor[3]} stroke={REFLINE} strokeWidth="2.2" strokeLinecap="round" />}
      {p.extra && <line x1={p.extra[0]} y1={p.extra[1]} x2={p.extra[2]} y2={p.extra[3]} stroke={REFLINE} strokeWidth="2.2" strokeLinecap="round" />}
      <g className={`pose-${p.anim || "rep-down"}`} strokeLinejoin="round" fill="none">
        {seg(p.torso, hl.torso)}
        {seg(p.arms, hl.arms)}
        {seg(p.legs, hl.legs)}
        <circle cx={p.head[0]} cy={p.head[1]} r="5.2" fill={NEUTRAL} stroke="none" />
      </g>
    </svg>
  );
}

export default function App() {
  const todayIdx = new Date().getDay();
  const [day, setDay] = useState(todayIdx);
  const [expanded, setExpanded] = useState(null);
  const [tab, setTab] = useState("workout");
  const [done, setDone] = useState({});
  const [levels, setLevels] = useState({});
  const [timer, setTimer] = useState({ show:false, running:false, sec:0, max:120 });
  const timerRef = useRef(null);
  const [msgs, setMsgs] = useState([
    { role:"assistant", initial:true,
      content:"Hey! I'm your AI calisthenics coach 💪\n\nI know your profile: 15 yo · 173 cm · 20+ push-ups · 2–3 pull-ups · 8–10 dips.\n\nThis program is built around 4 skills — front lever, planche, handstand, and pistol squat — with push-ups/dips/pull-ups/squats as the basic strength underneath. Ask me anything!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const plan = PLAN[day];

  useEffect(() => {
    if (timer.running && timer.sec > 0) {
      timerRef.current = setTimeout(() => setTimer(t => ({...t, sec:t.sec-1})), 1000);
    } else if (timer.running && timer.sec === 0) {
      setTimer(t => ({...t, running:false}));
    }
    return () => clearTimeout(timerRef.current);
  }, [timer.running, timer.sec]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs, aiLoading]);

  const startTimer = (s) => { clearTimeout(timerRef.current); setTimer({show:true, running:true, sec:s, max:s}); };
  const toggleSet = (eid, si) => { const k=`${day}-${eid}-${si}`; setDone(d => ({...d, [k]:!d[k]})); };
  const isDone = (eid, si) => !!done[`${day}-${eid}-${si}`];
  const changeLevel = (eid, idx, len) => { const c=Math.max(0,Math.min(idx,len-1)); setLevels(l=>({...l,[eid]:c})); };

  const totalSets = plan.exercises?.reduce((a,e) => a+e.sets, 0)||0;
  const doneSets  = plan.exercises?.reduce((a,e) => {
    return a + Array.from({length:e.sets}).filter((_,i)=>isDone(e.id,i)).length;
  }, 0)||0;
  const progressPct = totalSets>0 ? Math.round((doneSets/totalSets)*100) : 0;

  const grouped = {};
  SEC_ORDER.forEach(s => { grouped[s] = plan.exercises?.filter(e=>e.sec===s)||[]; });

  const sendAI = async () => {
    if (!chatInput.trim() || aiLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const next = [...msgs, {role:"user", content:userMsg}];
    setMsgs(next);
    setAiLoading(true);
    const apiMsgs = next.filter(m=>!m.initial).slice(-12);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:800,
          system:`You are an expert calisthenics coach for a 15-year-old, 173cm athlete. Stats: 20+ push-ups, 2–3 pull-ups, 8–10 dips, 20+ squats. Goals: build toward front lever, planche, handstand, and pistol squat — with pull-ups, push-ups, dips, and squats as the basic strength foundation under all four. Currently viewing: ${plan.name} on ${plan.day}. Today's structure: Warm Up → Skills Work (the named advanced skill) → Volume Training (an easier regression of that same skill) → Accessories (basic pushing/pulling/squatting) → Cool Down. The app tracks Reps in Reserve (RIR), shown per progression level: skills work targets RIR 1–2 or a "seconds in reserve" buffer for holds, volume targets RIR 1–2, accessories range RIR 1–3 depending on joint risk, safe isolation moves like calf raises can go to RIR 0, and warm-ups/cool-downs never approach fatigue. Teach RIR simply: if they could've done 2–3 more clean reps it was too easy, if form broke they went too far. Be concise, encouraging, scientifically accurate. Always prioritise joint health and age-appropriate training. No weighted exercises recommended until age 16. Use emojis occasionally for tone.`,
          messages: apiMsgs
        })
      });
      const data = await res.json();
      const reply = data.content?.map(c=>c.text||"").join("")||"Connection issue — please try again.";
      setMsgs(p => [...p, {role:"assistant", content:reply}]);
    } catch {
      setMsgs(p => [...p, {role:"assistant", content:"Connection error. Please check your connection and try again."}]);
    }
    setAiLoading(false);
  };

  const pct = timer.max > 0 ? (timer.max - timer.sec) / timer.max : 0;
  const R = 38, CIRC = 2*Math.PI*R;
  const mins = Math.floor(timer.sec/60), secs = timer.sec%60;

  const QUICK_Q = [
    "How do I improve pull-ups fast?","What should I eat for muscle gain?",
    "How long until I get a tuck planche?","Is my hollow body technique correct?",
    "How do I progress my pistol squat?","What does RIR mean and how do I use it?"
  ];

  const fmtRest = (s) => s>=60 ? `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}` : `${s}s`;

  return (
    <div style={{minHeight:"100vh",background:"#07080f",color:"white",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",WebkitFontSmoothing:"antialiased"}}>
      {/* ═══ HEADER ═══ */}
      <div style={{background:`linear-gradient(145deg,${plan.grad[0]},${plan.grad[1]})`,padding:"16px 16px 10px",position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:520,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:2.5,textTransform:"uppercase",marginBottom:2}}>{plan.day}</div>
              <div style={{fontSize:24,fontWeight:900,letterSpacing:"-0.5px",lineHeight:1}}>{plan.icon} {plan.name}</div>
              {plan.exercises.length>0 && <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:3,maxWidth:220}}>{plan.tip?.slice(0,70)}…</div>}
            </div>
            {totalSets>0 && (
              <div style={{textAlign:"center",background:"rgba(0,0,0,0.2)",borderRadius:14,padding:"8px 14px",border:"1px solid rgba(255,255,255,0.1)"}}>
                <div style={{fontSize:24,fontWeight:900,color:progressPct===100?"#4ade80":plan.col,lineHeight:1}}>{progressPct}%</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.45)",marginTop:1,letterSpacing:0.5}}>{doneSets}/{totalSets} SETS</div>
              </div>
            )}
          </div>
          {/* Progress Bar */}
          {totalSets>0 && (
            <div style={{height:3,background:"rgba(255,255,255,0.15)",borderRadius:2,marginBottom:10,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progressPct}%`,background:progressPct===100?"#4ade80":plan.col,borderRadius:2,transition:"width 0.5s ease"}} />
            </div>
          )}
          {/* Day Picker */}
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
            {["S","M","T","W","T","F","S"].map((d,i) => (
              <button key={i} onClick={()=>{setDay(i);setExpanded(null);}}
                style={{flexShrink:0,width:36,height:36,borderRadius:10,border:"none",cursor:"pointer",fontWeight:800,fontSize:12,transition:"all .15s",
                  background:i===day?"white":i===todayIdx?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.1)",
                  color:i===day?"#0a0a0f":"rgba(255,255,255,0.85)",
                  transform:i===day?"scale(1.1)":"scale(1)",
                  boxShadow:i===day?`0 4px 14px rgba(0,0,0,0.35),0 0 0 2px ${plan.col}`:i===todayIdx?"0 0 0 1.5px rgba(255,255,255,0.4)":"none"
                }}>{d}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ TAB BAR ═══ */}
      <div style={{background:"rgba(10,10,18,0.95)",borderBottom:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(10px)",position:"sticky",top:133,zIndex:40}}>
        <div style={{maxWidth:520,margin:"0 auto",display:"flex"}}>
          {[["workout","🏋️ Workout"],["ai","🤖 AI Coach"]].map(([t,label])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{flex:1,padding:"11px 0",background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,transition:"all .2s",
                color:tab===t?"white":"rgba(255,255,255,0.38)",
                borderBottom:`2px solid ${tab===t?plan.col:"transparent"}`}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:520,margin:"0 auto",paddingBottom:110}}>
        {/* ═══ WORKOUT TAB ═══ */}
        {tab==="workout" && (
          <>
            {plan.exercises.length===0 && (
              <div style={{textAlign:"center",padding:"52px 28px"}}>
                <div style={{fontSize:72,marginBottom:16}}>🌙</div>
                <div style={{fontSize:24,fontWeight:900,marginBottom:8}}>Rest & Recovery</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:28}}>{plan.tip}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  {[["💤","Sleep 8+ hours","Growth hormone peaks during deep sleep"],["🥩","Eat 1.6–2g protein/kg","Muscle protein synthesis stays elevated"],["🧘","Light mobility work","Gentle movement aids recovery"],["💧","Hydrate well","Muscles are ~75% water"]].map(([ic,t,d])=>(
                    <div key={t} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"14px 12px",textAlign:"left"}}>
                      <div style={{fontSize:20,marginBottom:6}}>{ic}</div>
                      <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:3}}>{t}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.4}}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {plan.exercises.length>0 && SEC_ORDER.map(secKey=>{
              const exs = grouped[secKey];
              if(!exs.length) return null;
              const s = SEC[secKey];
              const secDone = exs.filter(e=>Array.from({length:e.sets}).every((_,i)=>isDone(e.id,i))).length;
              return (
                <div key={secKey} style={{marginTop:18}}>
                  {/* ── Section Header ── */}
                  <div style={{padding:"0 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{height:1,flex:1,background:`linear-gradient(to right,${s.bd},transparent)`}} />
                    <div style={{display:"flex",alignItems:"center",gap:6,background:s.bg,border:`1px solid ${s.bd}`,borderRadius:22,padding:"5px 14px"}}>
                      <span style={{fontSize:12,fontWeight:800,color:s.col,letterSpacing:0.5}}>{s.label}</span>
                      {secDone===exs.length&&exs.length>0&&<span style={{fontSize:10,color:"#4ade80"}}>✓</span>}
                    </div>
                    <div style={{height:1,flex:1,background:`linear-gradient(to left,${s.bd},transparent)`}} />
                  </div>

                  {/* ── Exercise Cards ── */}
                  {exs.map(ex=>{
                    const isExp = expanded===ex.id;
                    const allSets = Array.from({length:ex.sets});
                    const doneCount = allSets.filter((_,i)=>isDone(ex.id,i)).length;
                    const allComplete = doneCount===ex.sets;
                    const curLv = levels[ex.id] ?? ex.curLv;
                    const curLevelData = ex.levels[curLv] || ex.levels[0];
                    const easierLv = curLv>0 ? ex.levels[curLv-1] : null;
                    const harderLv = curLv<ex.levels.length-1 ? ex.levels[curLv+1] : null;
                    return (
                      <div key={ex.id} style={{margin:"0 10px 8px",borderRadius:18,border:`1px solid ${allComplete?"rgba(74,222,128,0.35)":"rgba(255,255,255,0.07)"}`,
                        background:allComplete?"rgba(74,222,128,0.04)":"rgba(255,255,255,0.025)",overflow:"hidden",
                        boxShadow:allComplete?"0 0 20px rgba(74,222,128,0.08)":"none",transition:"all .25s"}}>
                        {/* Card Top */}
                        <button onClick={()=>setExpanded(isExp?null:ex.id)}
                          style={{width:"100%",textAlign:"left",background:"none",border:"none",padding:"14px 14px 0",cursor:"pointer",color:"white"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,gap:10}}>
                            <div style={{width:60,height:60,borderRadius:13,flexShrink:0,padding:8,
                              background:"rgba(255,255,255,0.04)",
                              border:`1px solid ${allComplete?"rgba(74,222,128,0.4)":"rgba(255,255,255,0.1)"}`}}>
                              <ExerciseIcon pose={curLevelData.pose} muscle={ex.muscle} />
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:14,fontWeight:800,color:allComplete?"#4ade80":"white",marginBottom:2}}>{curLevelData.n}</div>
                              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:5}}>{ex.name} · {ex.muscle}</div>
                              <div style={{display:"flex",gap:10,fontSize:11,flexWrap:"wrap",rowGap:4}}>
                                <span style={{color:"rgba(255,255,255,0.55)"}}>📊 <b>{ex.sets}×</b>{curLevelData.reps}</span>
                                {ex.rest>0&&<span style={{color:"rgba(255,255,255,0.45)"}}>⏸ {fmtRest(ex.rest)}</span>}
                                <span style={{color:rirColor(curLevelData.rir),fontWeight:700}}>🎯 {curLevelData.rir}</span>
                              </div>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                              <span style={{fontSize:11,color:isExp?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.2)",transition:"color .2s"}}>{isExp?"▲":"▼"}</span>
                              <span style={{fontSize:10,fontWeight:800,color:allComplete?"#4ade80":doneCount>0?"#fb923c":"rgba(255,255,255,0.25)"}}>{doneCount}/{ex.sets}</span>
                            </div>
                          </div>
                          {/* Set Bubbles */}
                          <div style={{display:"flex",gap:5,padding:"10px 0 14px"}}>
                            {allSets.map((_,i)=>(
                              <button key={i} onClick={e=>{e.stopPropagation();toggleSet(ex.id,i);}}
                                style={{flex:1,height:30,borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:800,transition:"all .15s",
                                  background:isDone(ex.id,i)?"#22c55e":"rgba(255,255,255,0.07)",
                                  color:isDone(ex.id,i)?"white":"rgba(255,255,255,0.35)",
                                  transform:isDone(ex.id,i)?"scale(1.04)":"scale(1)",
                                  boxShadow:isDone(ex.id,i)?"0 2px 8px rgba(34,197,94,0.45)":"none"
                                }}>{isDone(ex.id,i)?"✓":`S${i+1}`}</button>
                            ))}
                            {ex.rest>0&&(
                              <button onClick={e=>{e.stopPropagation();startTimer(ex.rest);}}
                                style={{padding:"0 10px",height:30,borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",border:`1px solid ${plan.col}50`,background:`${plan.col}18`,color:plan.col,transition:"all .15s"}}>
                                ⏱
                              </button>
                            )}
                          </div>
                        </button>

                        {/* ── Expanded Panel ── */}
                        {isExp&&(
                          <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:14,display:"flex",flexDirection:"column",gap:14}}>
                            {/* RIR Target */}
                            <div style={{background:`${rirColor(curLevelData.rir)}14`,border:`1px solid ${rirColor(curLevelData.rir)}35`,borderRadius:12,padding:"10px 12px",display:"flex",gap:9,alignItems:"flex-start"}}>
                              <span style={{fontSize:15,lineHeight:1.3}}>🎯</span>
                              <div>
                                <div style={{fontSize:11,fontWeight:800,color:rirColor(curLevelData.rir),marginBottom:2,letterSpacing:0.3}}>Target: {curLevelData.rir} · {curLevelData.reps}</div>
                                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.45}}>{ex.rirNote}</div>
                              </div>
                            </div>
                            {/* Coaching Cues */}
                            <div>
                              <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:9,flexWrap:"wrap"}}>
                                <span style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:2}}>🎯 Coaching Cues</span>
                              </div>
                              {curLevelData.cues.map((c,i)=>(
                                <div key={i} style={{display:"flex",gap:9,marginBottom:6}}>
                                  <span style={{fontSize:10,color:plan.col,fontWeight:900,fontFamily:"monospace",minWidth:14,paddingTop:1}}>{i+1}.</span>
                                  <span style={{fontSize:12,color:"rgba(255,255,255,0.72)",lineHeight:1.55}}>{c}</span>
                                </div>
                              ))}
                            </div>
                            {/* Easier / Harder */}
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                              {easierLv ? (
                                <button onClick={()=>changeLevel(ex.id,curLv-1,ex.levels.length)}
                                  style={{background:"rgba(96,165,250,.08)",border:"1px solid rgba(96,165,250,.22)",borderRadius:12,padding:"10px 11px",textAlign:"left",cursor:"pointer"}}>
                                  <div style={{fontSize:9,fontWeight:800,color:"#60a5fa",marginBottom:4,letterSpacing:0.5}}>⬇ Easier</div>
                                  <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:2}}>{easierLv.n}</div>
                                  <div style={{fontSize:11,color:"rgba(255,255,255,0.42)",lineHeight:1.4}}>{easierLv.d}</div>
                                </button>
                              ):(
                                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"10px 11px"}}>
                                  <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,0.25)",marginBottom:4,letterSpacing:0.5}}>⬇ Easier</div>
                                  <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.4)"}}>This is the starting point</div>
                                </div>
                              )}
                              {harderLv ? (
                                <button onClick={()=>changeLevel(ex.id,curLv+1,ex.levels.length)}
                                  style={{background:"rgba(251,146,60,.08)",border:"1px solid rgba(251,146,60,.22)",borderRadius:12,padding:"10px 11px",textAlign:"left",cursor:"pointer"}}>
                                  <div style={{fontSize:9,fontWeight:800,color:"#fb923c",marginBottom:4,letterSpacing:0.5}}>⬆ Harder</div>
                                  <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:2}}>{harderLv.n}</div>
                                  <div style={{fontSize:11,color:"rgba(255,255,255,0.42)",lineHeight:1.4}}>{harderLv.d}</div>
                                </button>
                              ):(
                                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"10px 11px"}}>
                                  <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,0.25)",marginBottom:4,letterSpacing:0.5}}>⬆ Harder</div>
                                  <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.4)"}}>🏆 Top of progression</div>
                                </div>
                              )}
                            </div>
                            {/* Progression Path */}
                            <div>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                                <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:2}}>📈 Progression Path</div>
                                <div style={{display:"flex",alignItems:"center",gap:5}}>
                                  <button onClick={()=>changeLevel(ex.id,curLv-1,ex.levels.length)} disabled={curLv===0}
                                    style={{width:19,height:19,borderRadius:6,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",
                                      color:curLv===0?"rgba(255,255,255,0.15)":"white",fontSize:12,fontWeight:800,cursor:curLv===0?"default":"pointer",
                                      display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,padding:0}}>−</button>
                                  <span style={{fontSize:9,color:"rgba(255,255,255,0.25)",minWidth:36,textAlign:"center"}}>Lv {curLv+1}/{ex.levels.length}</span>
                                  <button onClick={()=>changeLevel(ex.id,curLv+1,ex.levels.length)} disabled={curLv===ex.levels.length-1}
                                    style={{width:19,height:19,borderRadius:6,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",
                                      color:curLv===ex.levels.length-1?"rgba(255,255,255,0.15)":"white",fontSize:12,fontWeight:800,cursor:curLv===ex.levels.length-1?"default":"pointer",
                                      display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,padding:0}}>+</button>
                                </div>
                              </div>
                              <div style={{position:"relative"}}>
                                <div style={{position:"absolute",left:9,top:10,bottom:10,width:1,background:"rgba(255,255,255,0.07)"}} />
                                {ex.levels.map((lv,i)=>{
                                  const isPast=i<curLv, isCur=i===curLv;
                                  return (
                                    <button key={i} onClick={()=>changeLevel(ex.id,i,ex.levels.length)}
                                      style={{display:"flex",alignItems:"center",gap:10,marginBottom:5,position:"relative",zIndex:1,width:"100%",background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left"}}>
                                      <div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,
                                        background:isPast?"#22c55e":isCur?plan.col:"rgba(255,255,255,0.07)",
                                        color:isPast||isCur?"white":"rgba(255,255,255,0.25)",
                                        boxShadow:isCur?`0 0 12px ${plan.col}70`:"none",transition:"all .2s"}}>
                                        {isPast?"✓":isCur?"★":i+1}
                                      </div>
                                      <div style={{flex:1,fontSize:12,fontWeight:isCur?700:400,
                                        color:isPast?"#4ade80":isCur?"white":"rgba(255,255,255,0.3)",
                                        background:isCur?`${plan.col}14`:"transparent",
                                        border:isCur?`1px solid ${plan.col}28`:"1px solid transparent",
                                        borderRadius:8,padding:"4px 8px",transition:"all .2s"}}>
                                        {lv.n}{isCur&&<span style={{fontSize:9,color:plan.col,marginLeft:6,fontWeight:800}}>← YOU</span>}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                              <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",marginTop:8,fontStyle:"italic",lineHeight:1.4}}>
                                Tap any level to jump there, or use −/+ to move one step. Standard rule: 3 sets × 10 clean reps in 2–3 consecutive sessions → advance.
                              </div>
                            </div>
                            {/* Rest Timer CTA */}
                            {ex.rest>0&&(
                              <button onClick={()=>startTimer(ex.rest)}
                                style={{width:"100%",padding:"11px 0",borderRadius:12,border:`1px solid ${plan.col}40`,background:`${plan.col}14`,color:plan.col,fontWeight:800,fontSize:13,cursor:"pointer",letterSpacing:0.3}}>
                                ⏱ Start {fmtRest(ex.rest)} Rest Timer
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* ── Week Overview ── */}
            {plan.exercises.length>0&&(
              <div style={{margin:"20px 10px 0",borderRadius:18,border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.02)",padding:"14px 14px 10px"}}>
                <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:2,marginBottom:10}}>📅 Full Week Schedule</div>
                {Object.entries(PLAN).map(([d,p])=>{
                  const isCur=parseInt(d)===day, isToday=parseInt(d)===todayIdx;
                  return (
                    <button key={d} onClick={()=>{setDay(parseInt(d));setExpanded(null);}}
                      style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 8px",borderRadius:9,cursor:"pointer",
                        background:isCur?"rgba(255,255,255,0.07)":"transparent",border:"none",color:"white",marginBottom:2}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:14}}>{p.icon}</span>
                        <span style={{fontSize:12,fontWeight:isCur?700:400,color:isCur?"white":isToday?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.3)"}}>{p.day}</span>
                        {isToday&&<span style={{fontSize:8,background:"rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.6)",borderRadius:10,padding:"1px 6px",fontWeight:700,letterSpacing:0.5}}>TODAY</span>}
                      </div>
                      <span style={{fontSize:11,fontWeight:600,color:isCur?plan.col:"rgba(255,255,255,0.2)"}}>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ═══ AI COACH TAB ═══ */}
        {tab==="ai"&&(
          <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 175px)"}}>
            {/* Messages */}
            <div style={{flex:1,overflowY:"auto",padding:"12px 12px 0"}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10}}>
                  <div style={{maxWidth:"87%",borderRadius:18,padding:"10px 14px",fontSize:13,lineHeight:1.6,
                    background:m.role==="user"?`linear-gradient(135deg,${plan.grad[0]},${plan.grad[1]})`:"rgba(255,255,255,0.07)",
                    borderBottomRightRadius:m.role==="user"?4:18,borderBottomLeftRadius:m.role==="assistant"?4:18,
                    border:m.role==="assistant"?"1px solid rgba(255,255,255,0.08)":"none",color:"white"}}>
                    {m.role==="assistant"&&<div style={{fontSize:9,fontWeight:900,color:plan.col,marginBottom:5,letterSpacing:1,textTransform:"uppercase"}}>🤖 AI Coach</div>}
                    <div style={{whiteSpace:"pre-wrap"}}>{m.content}</div>
                  </div>
                </div>
              ))}
              {aiLoading&&(
                <div style={{display:"flex",marginBottom:10}}>
                  <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,borderBottomLeftRadius:4,padding:"12px 16px"}}>
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      {[0,1,2].map(i=>(
                        <div key={i} style={{width:7,height:7,borderRadius:"50%",background:plan.col,
                          animation:"bounce 1.2s ease infinite",animationDelay:`${i*0.18}s`}} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Quick Questions */}
            {msgs.length<=2&&(
              <div style={{padding:"8px 12px",display:"flex",flexWrap:"wrap",gap:6}}>
                {QUICK_Q.map(q=>(
                  <button key={q} onClick={()=>setChatInput(q)}
                    style={{fontSize:11,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.65)",borderRadius:20,padding:"6px 12px",cursor:"pointer",lineHeight:1.3}}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            {/* Input */}
            <div style={{padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,0.07)",background:"rgba(7,8,15,0.98)"}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input ref={inputRef} value={chatInput} onChange={e=>setChatInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendAI()}
                  placeholder="Ask your coach anything..."
                  style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"10px 14px",color:"white",fontSize:13,outline:"none",fontFamily:"inherit"}} />
                <button onClick={sendAI} disabled={!chatInput.trim()||aiLoading}
                  style={{width:42,height:42,borderRadius:13,border:"none",background:`linear-gradient(135deg,${plan.grad[0]},${plan.grad[1]})`,color:"white",fontSize:16,cursor:"pointer",flexShrink:0,opacity:!chatInput.trim()||aiLoading?0.38:1,transition:"opacity .15s"}}>
                  ➤
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ FLOATING TIMER ═══ */}
      {timer.show&&(
        <div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",zIndex:200}}>
          <div style={{background:"rgba(12,13,22,0.97)",border:`1px solid ${timer.sec===0?"#22c55e44":plan.col+"44"}`,borderRadius:22,padding:"12px 16px",
            boxShadow:`0 12px 40px rgba(0,0,0,0.6),0 0 30px ${timer.sec===0?"rgba(34,197,94,0.15)":plan.col+"22"}`,
            display:"flex",alignItems:"center",gap:14,minWidth:230,backdropFilter:"blur(20px)"}}>
            {/* Circle Timer */}
            <div style={{position:"relative",width:76,height:76,flexShrink:0}}>
              <svg style={{transform:"rotate(-90deg)"}} width="76" height="76" viewBox="0 0 92 92">
                <circle cx="46" cy="46" r={R} stroke="rgba(255,255,255,0.07)" strokeWidth="4.5" fill="none" />
                <circle cx="46" cy="46" r={R} stroke={timer.sec===0?"#22c55e":plan.col} strokeWidth="4.5" fill="none"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC*(1-pct)} strokeLinecap="round"
                  style={{transition:"stroke-dashoffset 1s linear,stroke 0.3s"}} />
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                <span style={{fontSize:timer.sec===0?12:15,fontWeight:900,color:timer.sec===0?"#4ade80":"white",lineHeight:1}}>
                  {timer.sec===0?"GO!":mins>0?`${mins}:${String(secs).padStart(2,"0")}`:secs}
                </span>
              </div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.38)",marginBottom:2,letterSpacing:0.5}}>REST TIMER</div>
              <div style={{fontSize:14,fontWeight:800,color:timer.sec===0?"#4ade80":"white"}}>
                {timer.sec===0?"Ready for next set!":timer.running?"Recovering…":"Paused"}
              </div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.28)",marginTop:1}}>{timer.max}s total</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <button onClick={()=>setTimer(t=>({...t,running:!t.running}))}
                style={{width:36,height:36,borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.07)",color:"white",cursor:"pointer",fontSize:13}}>
                {timer.running?"⏸":"▶"}
              </button>
              <button onClick={()=>setTimer(t=>({...t,show:false,running:false}))}
                style={{width:36,height:36,borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:12}}>
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-7px)} }
        @keyframes figRepDown { 0%,100%{transform:translateY(0) scaleY(1)} 50%{transform:translateY(4px) scaleY(0.96)} }
        @keyframes figRepUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes figRepSquat { 0%,100%{transform:translateY(0) scaleY(1)} 50%{transform:translateY(5px) scaleY(0.92)} }
        @keyframes figHold { 0%,100%{transform:scale(1)} 50%{transform:scale(0.95)} }
        @keyframes figSway { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
        @keyframes figBalance { 0%,100%{transform:translateX(-1.5px) rotate(-2deg)} 50%{transform:translateX(1.5px) rotate(2deg)} }
        .pose-rep-down{animation:figRepDown 1.1s ease-in-out infinite;transform-origin:50% 50%;}
        .pose-rep-up{animation:figRepUp 1.1s ease-in-out infinite;transform-origin:50% 50%;}
        .pose-rep-squat{animation:figRepSquat 1.2s ease-in-out infinite;transform-origin:50% 50%;}
        .pose-hold{animation:figHold 1.8s ease-in-out infinite;transform-origin:50% 50%;}
        .pose-sway{animation:figSway 2.2s ease-in-out infinite;transform-origin:50% 15%;}
        .pose-balance{animation:figBalance 2s ease-in-out infinite;transform-origin:50% 90%;}
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:0;height:0;}
        button:active{opacity:0.8;}
        input::placeholder{color:rgba(255,255,255,0.3);}
      `}</style>
    </div>
  );
}