import { useState, useEffect, useRef, useCallback } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const NAV = ["Experience", "Projects", "Skills", "About", "Contact"];

const EXPERIENCE = [
  {
    company: "Delta Air Lines",
    role: "Operations Analytics & Data Engineering Co-op",
    location: "Atlanta, GA",
    date: "Aug 2024 – Dec 2024 · May 2025 – Dec 2025",
    accent: "#2fd4a0",
    bullets: [
      "Improved reliability of operational analytics pipelines by 30% via automated validation across Python ETL workflows using PostgreSQL and Teradata.",
      "Reduced troubleshooting time by 30% by building automated testing frameworks across datasets from 50+ airports.",
      "Eliminated manual reporting by automating batch analytics pipelines with Python and AWS S3 using TDD practices.",
      "Migrated legacy SAS systems to Python-based pipelines, improving maintainability for downstream teams.",
      "Contributed production code via Git CI/CD in Red Hat Linux; collaborated with cloud and security teams on AWS deployment.",
    ],
  },
  {
    company: "upGrad",
    role: "Data Science Intern",
    location: "Hyderabad, India",
    date: "May 2024 – Jul 2024",
    accent: "#f7c26f",
    bullets: [
      "Improved lead targeting accuracy by 20% by building an LLM-powered audio analysis pipeline using Hugging Face Transformers and LlamaIndex over 500+ call recordings.",
      "Implemented embedding-based semantic retrieval over unstructured audio transcripts for scalable GenAI insight extraction.",
      "Collaborated with engineering and analytics teams to operationalize model outputs into product workflows.",
    ],
  },
  {
    company: "Northeastern University",
    role: "Teaching Assistant – CS Fundamentals (Kotlin)",
    location: "Boston, MA",
    date: "Ongoing",
    accent: "#7c6ff7",
    bullets: [
      "Mentored 30 students on debugging, testing, and software design principles.",
      "Graded projects enforcing code quality and engineering best practices.",
    ],
  },
];

const PROJECTS = [
  {
    title: "Semantic Restaurant Search",
    subtitle: "Large-Scale Vector Retrieval",
    desc: "Improved search relevance by 158% (MAP@100) using SBERT embeddings and FAISS indexing across 1M+ reviews. End-to-end ML pipeline for embedding, storage, retrieval, and reranking.",
    tags: ["Python", "SBERT", "FAISS", "ML Pipeline"],
    accent: "#2fd4a0",
    github: "#",
  },
  {
    title: "GameNite",
    subtitle: "Real-Time Multiplayer Platform",
    desc: "Led backend architecture and Agile sprint planning for a 4-person team. Owned design decisions balancing scalability with feature scope; enforced TDD and conducted code reviews.",
    tags: ["TypeScript", "React", "MongoDB", "WebSockets"],
    accent: "#7c6ff7",
    github: "#",
    demo: "#",
  },
  {
    title: "FinForecast",
    subtitle: "Reinforcement Learning Trading Model",
    desc: "Q-learning model learning optimal buy/sell/hold strategies for tech equities trained on historical stock data. Modeled correlated movement across the S&P IT sector.",
    tags: ["Python", "PyTorch", "Reinforcement Learning", "Finance"],
    accent: "#f76f6f",
    github: "#",
  },
];

const SKILLS = [
  { label: "Languages", color: "#7c6ff7", items: ["Python", "JavaScript", "TypeScript", "Java", "Kotlin", "SQL", "R"] },
  { label: "ML & AI", color: "#2fd4a0", items: ["PyTorch", "TensorFlow", "Hugging Face", "SBERT", "LlamaIndex", "FAISS"] },
  { label: "Frontend & Backend", color: "#f76f6f", items: ["React", "Node.js", "WebSockets", "MongoDB", "PostgreSQL", "Teradata"] },
  { label: "Cloud & DevOps", color: "#f7c26f", items: ["AWS S3/EC2/Lambda", "Docker", "CI/CD", "Git", "Linux", "Agile"] },
];

const TIMELINE = [
  { year: "2025", title: "Delta Co-op (Return) · McKinsey Forward", sub: "2nd rotation at Delta + leadership program" },
  { year: "2024", title: "Delta Air Lines Co-op · upGrad Intern", sub: "Data Engineering + GenAI audio pipelines" },
  { year: "2022", title: "Northeastern University", sub: "B.S. CS, Concentration in AI · Expected May 2026" },
];

const COLORS = {
  purple: [124, 111, 247],
  teal: [47, 212, 160],
  coral: [247, 111, 111],
  amber: [247, 194, 111],
  white: [232, 232, 240],
};

// ── CURSOR CANVAS ─────────────────────────────────────────────────────────────
function CursorCanvas({ colorMode, brushSize }) {
  const canvasRef = useRef(null);
  const blobs = useRef([]);
  const rafRef = useRef(null);
  const rainbowHue = useRef(0);
  const last = useRef({ x: -999, y: -999 });

  const spawnBlob = useCallback((x, y) => {
    let r, g, b;
    if (colorMode === "rainbow") {
      rainbowHue.current = (rainbowHue.current + 3) % 360;
      const h = rainbowHue.current;
      const c = 0.9 * (1 - Math.abs((2 * 65) / 100 - 1));
      const x2 = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = 65 / 100 - c / 2;
      let rr = 0, gg = 0, bb = 0;
      if (h < 60) { rr = c; gg = x2; } else if (h < 120) { rr = x2; gg = c; }
      else if (h < 180) { gg = c; bb = x2; } else if (h < 240) { gg = x2; bb = c; }
      else if (h < 300) { rr = x2; bb = c; } else { rr = c; bb = x2; }
      r = Math.round((rr + m) * 255); g = Math.round((gg + m) * 255); b = Math.round((bb + m) * 255);
    } else {
      [r, g, b] = COLORS[colorMode] || COLORS.purple;
    }
    blobs.current.push({ x, y, r, g, b, radius: brushSize, born: performance.now() });
  }, [colorMode, brushSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const FADE = 2200;
    const loop = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blobs.current = blobs.current.filter(b => {
        const age = now - b.born;
        if (age > FADE) return false;
        const p = age / FADE, alpha = (1 - p) * (1 - p) * 0.42;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, `rgba(${b.r},${b.g},${b.b},${alpha})`);
        grad.addColorStop(0.5, `rgba(${b.r},${b.g},${b.b},${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${b.r},${b.g},${b.b},0)`);
        ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        return true;
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onMove = (e) => {
      const dx = e.clientX - last.current.x, dy = e.clientY - last.current.y;
      if (dx * dx + dy * dy > 25) { spawnBlob(e.clientX, e.clientY); last.current = { x: e.clientX, y: e.clientY }; }
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, [spawnBlob]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// ── COLOR PICKER ──────────────────────────────────────────────────────────────
function ColorPicker({ colorMode, setColorMode, brushSize, setBrushSize, onClear }) {
  const swatches = [
    { key: "purple", bg: "#7c6ff7" }, { key: "teal", bg: "#2fd4a0" },
    { key: "coral", bg: "#f76f6f" }, { key: "amber", bg: "#f7c26f" },
    { key: "white", bg: "#e8e8f0" },
    { key: "rainbow", bg: "linear-gradient(135deg,#f76f6f,#f7c26f,#2fd4a0,#7c6ff7)" },
  ];
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl p-4 flex flex-col gap-3 text-sm shadow-2xl"
      style={{ background: "#16161d", border: "1px solid #2a2a38" }}>
      <span className="font-mono text-xs" style={{ color: "#2fd4a0" }}>🎨 Cursor Color</span>
      <div className="flex gap-2 items-center">
        {swatches.map(s => (
          <button key={s.key} onClick={() => setColorMode(s.key)}
            className="w-5 h-5 rounded-full transition-all duration-150 flex-shrink-0"
            style={{ background: s.bg, border: colorMode === s.key ? "2px solid #fff" : "2px solid transparent", transform: colorMode === s.key ? "scale(1.2)" : "scale(1)" }} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span style={{ color: "#888899", fontSize: ".78rem" }}>Size</span>
        <input type="range" min="10" max="80" value={brushSize} onChange={e => setBrushSize(+e.target.value)}
          className="w-20" style={{ accentColor: "#7c6ff7" }} />
      </div>
      <button onClick={onClear} className="font-mono text-xs px-2 py-1 rounded transition-all"
        style={{ background: "transparent", border: "1px solid #2a2a38", color: "#888899" }}
        onMouseEnter={e => { e.target.style.borderColor = "#f76f6f"; e.target.style.color = "#f76f6f"; }}
        onMouseLeave={e => { e.target.style.borderColor = "#2a2a38"; e.target.style.color = "#888899"; }}>
        ✕ Clear
      </button>
    </div>
  );
}

// ── SKETCH CIRCLE (name) ──────────────────────────────────────────────────────
const sketchStyle = `
@keyframes sketchDraw { to { stroke-dashoffset: 0; } }
.sketch-path { stroke-dasharray:1000; stroke-dashoffset:1000; animation: sketchDraw 1.2s cubic-bezier(.4,0,.2,1) forwards; }
.sketch-path-2 { stroke-dasharray:1000; stroke-dashoffset:1000; animation: sketchDraw 1.2s .3s cubic-bezier(.4,0,.2,1) forwards; }
.squiggle-path { stroke-dasharray:600; stroke-dashoffset:600; animation: sketchDraw 1s .8s cubic-bezier(.4,0,.2,1) forwards; }
`;

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [colorMode, setColorMode] = useState("purple");
  const [brushSize, setBrushSize] = useState(30);
  const [blobsRef] = useState({ current: [] }); // shared ref trick for clear

  // We need to clear blobs externally — use a key to remount canvas
  const [canvasKey, setCanvasKey] = useState(0);
  const handleClear = () => setCanvasKey(k => k + 1);

  const scrollTo = (id) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#0f0f13", color: "#e8e8f0", fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh" }}>
      <style>{sketchStyle}</style>
      <CursorCanvas key={canvasKey} colorMode={colorMode} brushSize={brushSize} />
      <ColorPicker colorMode={colorMode} setColorMode={setColorMode} brushSize={brushSize} setBrushSize={setBrushSize} onClear={handleClear} />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-10 py-4"
        style={{ background: "rgba(15,15,19,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2a2a38" }}>
        <span className="font-mono font-bold text-lg" style={{ color: "#7c6ff7" }}>PS</span>
        <ul className="flex gap-8 list-none">
          {NAV.map(n => (
            <li key={n}><button onClick={() => scrollTo(n)} className="text-sm transition-colors duration-200"
              style={{ color: "#888899", background: "none", border: "none", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = "#e8e8f0"} onMouseLeave={e => e.target.style.color = "#888899"}>{n}</button></li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-10 pt-32 pb-16 relative z-10" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-6"
          style={{ color: "#2fd4a0", background: "rgba(47,212,160,.1)", border: "1px solid rgba(47,212,160,.25)" }}>
          Open to SWE & ML/Data internships · May 2026
        </div>
        <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)" }}>
          Hi, I'm{" "}
          <span className="relative inline-block">
            <span style={{ background: "linear-gradient(135deg,#7c6ff7,#2fd4a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Praveen Sinha.
            </span>
            <svg className="absolute overflow-visible pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% + 28px)", height: "calc(100% + 18px)" }} viewBox="0 0 320 60" preserveAspectRatio="none">
              <path className="sketch-path" fill="none" stroke="#7c6ff7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M10,30 C8,10 60,-4 160,2 C260,8 318,14 316,30 C314,46 260,58 160,58 C60,58 12,50 10,30 Z" />
              <path className="sketch-path-2" fill="none" stroke="#2fd4a0" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" d="M14,32 C13,14 62,0 160,5 C258,10 314,17 313,32 C312,47 258,56 160,55 C62,54 15,50 14,32 Z" />
            </svg>
          </span>
          <br />I build pipelines, models,<br />and the apps around them.
        </h1>
        <p className="text-lg mb-6 relative inline-block" style={{ color: "#888899", maxWidth: 560 }}>
          CS + AI student at Northeastern · 1.5 years at Delta Air Lines building{" "}
          <span className="relative inline">
            data engineering & ML pipelines
            <svg className="absolute left-0 overflow-visible pointer-events-none" style={{ bottom: -6, width: "100%", height: 10 }} viewBox="0 0 400 10" preserveAspectRatio="none">
              <path className="squiggle-path" fill="none" stroke="#f7c26f" strokeWidth="2.2" strokeLinecap="round" d="M0,5 C30,1 60,9 90,5 C120,1 150,9 180,5 C210,1 240,9 270,5 C300,1 330,9 360,5 C380,2 395,6 400,5" />
            </svg>
          </span>
          {" "}at scale.
        </p>
        <div className="flex flex-wrap gap-6 mb-8 font-mono text-sm">
          {[["✉", "sinha.pra@northeastern.edu", "mailto:sinha.pra@northeastern.edu"],
            ["📞", "(857) 313-0350", "tel:8573130350"],
            ["in", "LinkedIn", "#"],
            ["⌥", "GitHub", "#"]].map(([icon, label, href]) => (
            <a key={label} href={href} className="transition-colors duration-200" style={{ color: "#888899", textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "#2fd4a0"} onMouseLeave={e => e.target.style.color = "#888899"}>
              {icon} {label}
            </a>
          ))}
        </div>
        <div className="flex gap-4 flex-wrap">
          <button onClick={() => scrollTo("Experience")} className="px-7 py-3 rounded-lg font-semibold text-white transition-all duration-200"
            style={{ background: "#7c6ff7" }} onMouseEnter={e => { e.target.style.background = "#6a5de8"; e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.target.style.background = "#7c6ff7"; e.target.style.transform = "none"; }}>
            View Experience
          </button>
          <a href="#" className="px-7 py-3 rounded-lg font-semibold transition-all duration-200"
            style={{ background: "transparent", border: "1px solid #2a2a38", color: "#e8e8f0", textDecoration: "none" }}
            onMouseEnter={e => { e.target.style.borderColor = "#7c6ff7"; e.target.style.color = "#7c6ff7"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.borderColor = "#2a2a38"; e.target.style.color = "#e8e8f0"; e.target.style.transform = "none"; }}>
            Download Resume ↓
          </a>
        </div>
      </section>

      <Divider />

      {/* EXPERIENCE */}
      <section id="experience" className="py-20 px-10 relative z-10" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <SectionLabel>// where I've worked</SectionLabel>
        <h2 className="text-4xl font-bold mb-10">Experience <span style={{ color: "#888899", fontWeight: 400 }}>— industry & research</span></h2>
        <div className="flex flex-col gap-5">
          {EXPERIENCE.map(e => (
            <div key={e.company} className="rounded-xl p-6 transition-all duration-200"
              style={{ background: "#16161d", border: "1px solid #2a2a38", borderLeft: `3px solid ${e.accent}` }}
              onMouseEnter={el => el.currentTarget.style.transform = "translateX(4px)"}
              onMouseLeave={el => el.currentTarget.style.transform = "none"}>
              <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                <span className="font-bold text-lg">{e.company}</span>
                <span className="font-mono text-xs" style={{ color: "#888899" }}>{e.date}</span>
              </div>
              <div className="text-sm mb-3" style={{ color: e.accent }}>{e.role} · {e.location}</div>
              <ul className="pl-4 flex flex-col gap-1" style={{ listStyleType: "disc" }}>
                {e.bullets.map((b, i) => <li key={i} className="text-sm" style={{ color: "#888899" }} dangerouslySetInnerHTML={{ __html: b.replace(/(\d+%)/g, '<strong style="color:#e8e8f0">$1</strong>') }} />)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* PROJECTS */}
      <section id="projects" className="py-20 px-10 relative z-10" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <SectionLabel>// what I've built</SectionLabel>
        <h2 className="text-4xl font-bold mb-10">Projects <span style={{ color: "#888899", fontWeight: 400 }}>— selected work</span></h2>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {PROJECTS.map(p => (
            <div key={p.title} className="rounded-xl p-6 relative overflow-hidden transition-all duration-200"
              style={{ background: "#16161d", border: "1px solid #2a2a38" }}
              onMouseEnter={el => { el.currentTarget.style.borderColor = p.accent; el.currentTarget.style.transform = "translateY(-4px)"; el.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,.4)"; }}
              onMouseLeave={el => { el.currentTarget.style.borderColor = "#2a2a38"; el.currentTarget.style.transform = "none"; el.currentTarget.style.boxShadow = "none"; }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: p.accent }} />
              <div className="font-bold text-lg mb-0.5">{p.title}</div>
              <div className="font-mono text-xs mb-2" style={{ color: p.accent }}>{p.subtitle}</div>
              <p className="text-sm mb-4" style={{ color: "#888899" }} dangerouslySetInnerHTML={{ __html: p.desc.replace(/(\d+%[^)]*\))/g, '<strong style="color:' + p.accent + '">$1</strong>') }} />
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(124,111,247,.12)", color: "#7c6ff7", border: "1px solid rgba(124,111,247,.2)" }}>{t}</span>)}
              </div>
              <div className="flex gap-4">
                {p.demo && <a href={p.demo} className="text-sm transition-colors" style={{ color: "#888899", textDecoration: "none" }} onMouseEnter={e => e.target.style.color = "#e8e8f0"} onMouseLeave={e => e.target.style.color = "#888899"}>⬡ Live Demo</a>}
                <a href={p.github} className="text-sm transition-colors" style={{ color: "#888899", textDecoration: "none" }} onMouseEnter={e => e.target.style.color = "#e8e8f0"} onMouseLeave={e => e.target.style.color = "#888899"}>⌥ GitHub</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* SKILLS */}
      <section id="skills" className="py-20 px-10 relative z-10" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <SectionLabel>// tools of the trade</SectionLabel>
        <h2 className="text-4xl font-bold mb-10">Skills <span style={{ color: "#888899", fontWeight: 400 }}>— tech I work with</span></h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}>
          {SKILLS.map(g => (
            <div key={g.label} className="rounded-xl p-5" style={{ background: "#16161d", border: "1px solid #2a2a38" }}>
              <div className="font-mono text-xs mb-3 tracking-wider" style={{ color: g.color }}>{g.label}</div>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map(s => <span key={s} className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,.05)", color: "#e8e8f0", border: "1px solid #2a2a38" }}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ABOUT */}
      <section id="about" className="py-20 px-10 relative z-10" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <SectionLabel>// who I am</SectionLabel>
        <h2 className="text-4xl font-bold mb-10">About <span style={{ color: "#888899", fontWeight: 400 }}>— background</span></h2>
        <div className="grid gap-12" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="flex flex-col gap-4 text-sm" style={{ color: "#888899" }}>
            <p>I'm <strong style={{ color: "#e8e8f0" }}>Praveen Sinha</strong>, a CS + AI student at Northeastern with hands-on industry experience at Delta Air Lines, where I spent 1.5 years building data engineering systems used across 50+ airports.</p>
            <p>I enjoy working across the full stack — from <strong style={{ color: "#e8e8f0" }}>fine-tuning LLMs</strong> and building vector search pipelines to architecting backend systems and shipping clean UIs.</p>
            <p>Outside of engineering, I'm a <strong style={{ color: "#e8e8f0" }}>Resident Assistant</strong> at Northeastern, a McKinsey Forward participant, and a TA helping students learn the fundamentals.</p>
          </div>
          <div className="flex flex-col gap-5">
            {TIMELINE.map(t => (
              <div key={t.year} className="flex gap-4">
                <span className="font-mono text-xs pt-1 flex-shrink-0" style={{ color: "#7c6ff7", minWidth: 48 }}>{t.year}</span>
                <div>
                  <div className="font-semibold text-sm">{t.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#888899" }}>{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* CONTACT */}
      <section id="contact" className="py-20 px-10 relative z-10 flex flex-col items-center text-center" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <SectionLabel>// get in touch</SectionLabel>
        <h2 className="text-4xl font-bold mb-4">Contact <span style={{ color: "#888899", fontWeight: 400 }}>— let's talk</span></h2>
        <p className="text-sm mb-8 max-w-md" style={{ color: "#888899" }}>I'm looking for SWE and ML/Data internships starting May 2026. If you think I'd be a good fit — or just want to chat — reach out!</p>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {[["✉", "sinha.pra@northeastern.edu", "mailto:sinha.pra@northeastern.edu"],
            ["in", "LinkedIn", "#"],
            ["⌥", "GitHub", "#"]].map(([icon, label, href]) => (
            <a key={label} href={href} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all duration-200"
              style={{ border: "1px solid #2a2a38", color: "#e8e8f0", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#7c6ff7"; e.currentTarget.style.color = "#7c6ff7"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a38"; e.currentTarget.style.color = "#e8e8f0"; e.currentTarget.style.transform = "none"; }}>
              {icon} {label}
            </a>
          ))}
        </div>
        <a href="#" className="px-7 py-3 rounded-lg font-semibold text-white transition-all duration-200"
          style={{ background: "#7c6ff7", textDecoration: "none" }}
          onMouseEnter={e => { e.target.style.background = "#6a5de8"; e.target.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.target.style.background = "#7c6ff7"; e.target.style.transform = "none"; }}>
          Download Resume ↓
        </a>
      </section>

      <footer className="text-center py-8 text-xs" style={{ color: "#888899", borderTop: "1px solid #2a2a38" }}>
        Built by Praveen Sinha · Northeastern University CS '26
      </footer>
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: "#7c6ff7" }}>{children}</p>;
}
function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid #2a2a38", margin: 0, position: "relative", zIndex: 1 }} />;
}