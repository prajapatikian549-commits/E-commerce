import useTypewriter from "../hooks/useTypewriter";
import { personal, stats } from "../data/portfolio";
import Avatar from "./Avatar";

export default function Hero({ dark }) {
  const typed = useTypewriter(personal.roles, { speed: 85, deleteSpeed: 45, pause: 1800 });

  return (
    <section id="hero" style={{
      background: dark
        ? "linear-gradient(135deg,#050d1a 0%,#0c1e36 55%,#091929 100%)"
        : "linear-gradient(135deg,#0f2744 0%,#1a3c5e 55%,#163354 100%)",
      color: "#fff", padding: "72px 1.5rem 60px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Radial shimmer */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 70% 50%,rgba(124,58,237,0.18) 0%,transparent 65%)",
      }} />

      {/* Floating dot particles */}
      {[...Array(18)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: i % 3 === 0 ? 4 : 2, height: i % 3 === 0 ? 4 : 2,
          borderRadius: "50%",
          background: i % 2 === 0 ? "rgba(245,158,11,0.4)" : "rgba(124,58,237,0.35)",
          top: `${10 + (i * 17) % 80}%`,
          left: `${5 + (i * 23) % 90}%`,
          animation: `particleFloat ${3 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
        }} />
      ))}

      <div style={{
        maxWidth: 1120, margin: "0 auto", position: "relative",
        display: "grid", gridTemplateColumns: "auto 1fr",
        alignItems: "center", gap: "3.5rem",
      }} className="hero-inner">

        {/* Avatar */}
        <Avatar />

        {/* Text */}
        <div>
          <span style={{
            display: "inline-block",
            background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.45)",
            color: "#f59e0b", fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "1.3px", textTransform: "uppercase",
            padding: "0.28rem 0.9rem", borderRadius: 20, marginBottom: "0.9rem",
          }}>
            Open to Opportunities
          </span>

          <h1 style={{ fontSize: "clamp(2rem,4vw,2.9rem)", fontWeight: 800, lineHeight: 1.12, marginBottom: "0.5rem" }}>
            Komal <span style={{ color: "#f59e0b" }}>Prajapati</span>
          </h1>

          {/* Typewriter */}
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.75)", marginBottom: "1.8rem", minHeight: "1.8rem" }}>
            {typed}
            <span style={{ borderRight: "2px solid #f59e0b", marginLeft: 2, animation: "blink 0.9s step-end infinite" }} />
          </p>

          {/* Stats */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.8rem" }}>
            {stats.map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 10, padding: "0.55rem 1.1rem", minWidth: 88, textAlign: "center",
                backdropFilter: "blur(8px)",
              }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Contacts */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.9rem" }}>
            {[
              { icon: "📞", label: personal.phone, href: `tel:${personal.phone}` },
              { icon: "✉️", label: personal.email, href: `mailto:${personal.email}` },
              { icon: "📍", label: personal.location, href: null },
            ].map((c) => (
              c.href
                ? <a key={c.label} href={c.href} style={{
                    color: "rgba(255,255,255,0.88)", textDecoration: "none",
                    fontSize: "0.84rem", display: "flex", alignItems: "center", gap: 6,
                    border: "1px solid rgba(255,255,255,0.25)", padding: "0.4rem 1rem",
                    borderRadius: 22, transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#f59e0b"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.25)"; e.currentTarget.style.transform="translateY(0)"; }}
                  >
                    {c.icon} {c.label}
                  </a>
                : <span key={c.label} style={{
                    color: "rgba(255,255,255,0.65)", fontSize: "0.84rem",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>{c.icon} {c.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
