import { experience } from "../data/portfolio";
import useInView from "../hooks/useInView";
import { SectionTitle } from "./Skills";

function TlCard({ job, dark, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      display: "grid", gridTemplateColumns: "130px 40px 1fr",
      alignItems: "start", marginBottom: "2.8rem",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateX(0)" : "translateX(-20px)",
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    }}>
      {/* Date label */}
      <div style={{ textAlign: "right", paddingRight: "1rem", paddingTop: "0.9rem" }}>
        <span style={{ display: "block", fontSize: "1rem", fontWeight: 800, color: dark ? "#e2e8f0" : "#0f2744" }}>
          {job.period.split(" – ")[0].split(" ").pop()}
        </span>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7c3aed" }}>
          {job.period.replace(/\d{4}/g, "").trim()}
        </span>
      </div>

      {/* Dot */}
      <div style={{
        width: 14, height: 14, borderRadius: "50%",
        background: job.current ? "#f59e0b" : "#7c3aed",
        border: `3px solid ${dark ? "#0d1829" : "#f0f4f8"}`,
        boxShadow: job.current ? "0 0 0 2px #f59e0b,0 0 12px rgba(245,158,11,0.5)" : "0 0 0 2px #7c3aed",
        position: "relative", left: -6, top: 16, flexShrink: 0, zIndex: 1,
      }} />

      {/* Card */}
      <div style={{
        background: dark ? "#111e33" : "#fff",
        borderRadius: 12, padding: "1.4rem 1.6rem",
        boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
        borderLeft: `3px solid ${job.current ? "#f59e0b" : "#7c3aed"}`,
        marginLeft: "1rem",
        transition: "box-shadow 0.25s, transform 0.25s, border-color 0.25s",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.14)"; e.currentTarget.style.transform="translateX(5px)"; e.currentTarget.style.borderColor="#f59e0b"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,0.07)"; e.currentTarget.style.transform="translateX(0)"; e.currentTarget.style.borderColor=job.current?"#f59e0b":"#7c3aed"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.3rem" }}>
          <span style={{ fontSize: "1.05rem", fontWeight: 800, color: dark ? "#f1f5f9" : "#0f2744" }}>{job.company}</span>
          {job.current
            ? <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.75rem", borderRadius: 20, background: "rgba(245,158,11,0.15)", color: "#b45309", border: "1px solid rgba(245,158,11,0.4)" }}>🟢 Current</span>
            : <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.75rem", borderRadius: 20, background: dark ? "#1e2d4a" : "#ede9fe", color: dark ? "#c4b5fd" : "#5b21b6" }}>{job.period}</span>
          }
        </div>
        <div style={{ fontSize: "0.88rem", color: "#1d5fa8", fontWeight: 700, marginBottom: "0.15rem" }}>{job.role}</div>
        <div style={{ fontSize: "0.78rem", color: dark ? "#64748b" : "#64748b", marginBottom: "0.9rem" }}>📍 {job.location}</div>
        <ul style={{ paddingLeft: "1.15rem", margin: 0 }}>
          {job.bullets.map((b, i) => (
            <li key={i} style={{ marginBottom: "0.45rem", fontSize: "0.88rem", lineHeight: 1.65, color: dark ? "#cbd5e1" : "#1e2d3d" }}
              dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Experience({ dark }) {
  return (
    <section id="experience" style={{ padding: "64px 1.5rem 48px", background: dark ? "#0a1220" : "#fff" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionTitle dark={dark} icon="💼" title="Work Experience" />
        <div style={{ position: "relative", paddingLeft: 0 }}>
          {/* Spine */}
          <div style={{
            position: "absolute", left: 140, top: 0, bottom: 0, width: 2,
            background: "linear-gradient(to bottom,#7c3aed,#1d5fa8,#cbd5e1)", borderRadius: 2,
          }} />
          {experience.map((j, i) => <TlCard key={j.company} job={j} dark={dark} delay={i * 120} />)}
        </div>
      </div>
    </section>
  );
}
