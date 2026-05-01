import { useState } from "react";
import { projects } from "../data/portfolio";
import useInView from "../hooks/useInView";
import { SectionTitle } from "./Skills";

const allTags = ["All", ...Array.from(new Set(projects.flatMap(p => p.tags)))];

function ProjectCard({ project, dark, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      background: dark ? "#111e33" : "#fff",
      borderRadius: 12, padding: "1.4rem 1.6rem",
      boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
      borderTop: "3px solid #1d5fa8",
      display: "flex", flexDirection: "column", gap: "0.6rem",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, box-shadow 0.25s, border-color 0.25s`,
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow="0 12px 32px rgba(29,95,168,0.18)"; e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.borderColor="#7c3aed"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,0.07)"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor="#1d5fa8"; }}
    >
      <h3 style={{ fontSize: "0.96rem", fontWeight: 800, color: dark ? "#f1f5f9" : "#0f2744" }}>{project.title}</h3>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem" }}>
        <span style={{ fontSize: "0.78rem", color: "#1d5fa8", fontWeight: 700 }}>{project.company}</span>
        <span style={{ fontSize: "0.75rem", color: dark ? "#64748b" : "#64748b" }}>{project.period}</span>
      </div>
      {project.client && (
        <span style={{ fontSize: "0.8rem", color: dark ? "#94a3b8" : "#64748b", fontStyle: "italic" }}>Client: {project.client}</span>
      )}
      <p style={{ fontSize: "0.87rem", color: dark ? "#cbd5e1" : "#1e2d3d", lineHeight: 1.65, flex: 1 }}>{project.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {project.tags.map(t => (
          <span key={t} style={{
            background: dark ? "#1e2d4a" : "#ede9fe", color: dark ? "#c4b5fd" : "#5b21b6",
            fontSize: "0.75rem", padding: "0.2rem 0.65rem", borderRadius: 20, fontWeight: 600,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function Projects({ dark }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? projects : projects.filter(p => p.tags.includes(filter));

  return (
    <section id="projects" style={{ padding: "64px 1.5rem 48px", background: dark ? "#0d1829" : "#f0f4f8" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionTitle dark={dark} icon="🚀" title="Projects" />

        {/* Filter tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setFilter(tag)} style={{
              padding: "0.35rem 1rem", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              background: filter === tag ? "#7c3aed" : (dark ? "#1e2d4a" : "#ede9fe"),
              color: filter === tag ? "#fff" : (dark ? "#c4b5fd" : "#5b21b6"),
              border: filter === tag ? "2px solid #7c3aed" : "2px solid transparent",
              transition: "all 0.2s",
            }}>
              {tag}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1.4rem" }}>
          {filtered.map((p, i) => <ProjectCard key={p.title} project={p} dark={dark} delay={i * 80} />)}
        </div>
      </div>
    </section>
  );
}
