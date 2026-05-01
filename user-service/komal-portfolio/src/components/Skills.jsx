import { skills } from "../data/portfolio";
import useInView from "../hooks/useInView";

function SkillCard({ skill, dark, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      background: dark ? "#111e33" : "#fff",
      borderRadius: 12, padding: "1.2rem 1.4rem",
      borderTop: "3px solid #7c3aed",
      boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, box-shadow 0.25s, border-color 0.25s`,
      cursor: "default",
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow="0 10px 30px rgba(124,58,237,0.18)"; e.currentTarget.style.borderColor="#f59e0b"; e.currentTarget.style.transform="translateY(-5px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,0.07)"; e.currentTarget.style.borderColor="#7c3aed"; e.currentTarget.style.transform="translateY(0)"; }}
    >
      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#7c3aed", fontWeight: 800, marginBottom: "0.8rem" }}>
        {skill.icon} {skill.category}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        {skill.tags.map(t => (
          <span key={t} style={{
            background: dark ? "#1e2d4a" : "#ede9fe", color: dark ? "#c4b5fd" : "#5b21b6",
            fontSize: "0.78rem", padding: "0.25rem 0.75rem",
            borderRadius: 20, fontWeight: 600,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function Skills({ dark }) {
  return (
    <section id="skills" style={{ padding: "64px 1.5rem 48px", background: dark ? "#0d1829" : "#f0f4f8" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionTitle dark={dark} icon="⚡" title="Technical Skills" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "1.2rem" }}>
          {skills.map((s, i) => <SkillCard key={s.category} skill={s} dark={dark} delay={i * 80} />)}
        </div>
      </div>
    </section>
  );
}

export function SectionTitle({ dark, icon, title }) {
  return (
    <h2 style={{
      fontSize: "1.3rem", fontWeight: 800, color: dark ? "#e2e8f0" : "#0f2744",
      marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem",
    }}>
      <span style={{
        width: 34, height: 34, borderRadius: 9,
        background: dark ? "#1a2e4a" : "#0f2744", color: "#f59e0b",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1rem", flexShrink: 0,
      }}>{icon}</span>
      {title}
      <span style={{ flex: 1, height: 2, background: "linear-gradient(to right,#cbd5e1,transparent)", borderRadius: 2 }} />
    </h2>
  );
}
