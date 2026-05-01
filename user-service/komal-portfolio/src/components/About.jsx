import { personal } from "../data/portfolio";
import useInView from "../hooks/useInView";
import { SectionTitle } from "./Skills";

export default function About({ dark }) {
  const [ref, inView] = useInView();
  return (
    <section id="about" style={{ padding: "64px 1.5rem 48px", background: dark ? "#0a1220" : "#fff" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionTitle dark={dark} icon="👩‍💻" title="Professional Summary" />
        <div ref={ref} style={{
          background: dark ? "#111e33" : "#fff",
          borderLeft: "4px solid #7c3aed", borderRadius: 10,
          padding: "1.5rem 1.8rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          fontSize: "0.97rem", lineHeight: 1.8,
          color: dark ? "#cbd5e1" : "#1e2d3d",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.25s",
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.12)"; e.currentTarget.style.transform="translateY(-3px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}
        >
          {personal.summary}
        </div>
      </div>
    </section>
  );
}
