import { education } from "../data/portfolio";
import useInView from "../hooks/useInView";
import { SectionTitle } from "./Skills";

export default function Education({ dark }) {
  const [ref, inView] = useInView();
  return (
    <section id="education" style={{ padding: "64px 1.5rem 48px", background: dark ? "#0a1220" : "#fff" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionTitle dark={dark} icon="🎓" title="Education" />
        <div ref={ref} style={{
          background: dark ? "#111e33" : "#fff",
          borderRadius: 12, padding: "1.6rem 1.8rem",
          boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
          display: "flex", alignItems: "flex-start", gap: "1.4rem",
          borderLeft: "4px solid #f59e0b",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.25s",
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow="0 10px 28px rgba(0,0,0,0.12)"; e.currentTarget.style.transform="translateY(-3px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}
        >
          <div style={{ fontSize: "2.2rem", flexShrink: 0 }}>🏛️</div>
          <div>
            <h3 style={{ fontSize: "1.02rem", fontWeight: 800, color: dark ? "#f1f5f9" : "#0f2744", marginBottom: "0.25rem" }}>{education.institution}</h3>
            <div style={{ fontSize: "0.9rem", color: "#1d5fa8", fontWeight: 700, marginBottom: "0.2rem" }}>{education.degree}</div>
            <div style={{ fontSize: "0.83rem", color: dark ? "#64748b" : "#64748b" }}>{education.period}</div>
            <span style={{
              display: "inline-block", marginTop: "0.5rem",
              background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)",
              color: "#92400e", fontSize: "0.78rem", fontWeight: 700,
              padding: "0.15rem 0.6rem", borderRadius: 12,
            }}>GPA: {education.gpa}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
