import { useState, useEffect } from "react";

const links = ["About", "Skills", "Experience", "Projects", "Education"];

export default function Nav({ dark, toggleDark }) {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      for (const id of [...links].reverse()) {
        const el = document.getElementById(id.toLowerCase());
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 200,
      background: scrolled
        ? (dark ? "rgba(10,20,40,0.96)" : "rgba(15,39,68,0.97)")
        : (dark ? "#0a1428" : "#0f2744"),
      backdropFilter: "blur(12px)",
      boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.35)" : "none",
      transition: "background 0.3s, box-shadow 0.3s",
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 1.5rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <a href="#" style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", textDecoration: "none", letterSpacing: 1 }}>
          KP <span style={{ color: "#f59e0b" }}>✦</span>
        </a>

        {/* Desktop links */}
        <ul style={{ listStyle: "none", display: "flex", gap: "1.8rem", margin: 0, padding: 0 }} className="nav-links">
          {links.map((l) => (
            <li key={l}>
              <button onClick={() => scrollTo(l)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: active === l ? "#f59e0b" : "rgba(255,255,255,0.78)",
                fontWeight: active === l ? 700 : 500,
                fontSize: "0.85rem", letterSpacing: 0.3,
                paddingBottom: 3,
                borderBottom: active === l ? "2px solid #f59e0b" : "2px solid transparent",
                transition: "all 0.2s", fontFamily: "inherit",
              }}>
                {l}
              </button>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Theme toggle */}
          <button onClick={toggleDark} title="Toggle theme" style={{
            background: dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 20, padding: "0.3rem 0.75rem",
            color: "#fff", cursor: "pointer", fontSize: "0.85rem",
            display: "flex", alignItems: "center", gap: 6,
            transition: "background 0.2s",
          }}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", color: "#fff", cursor: "pointer",
            fontSize: "1.4rem", display: "none", lineHeight: 1,
          }} className="hamburger">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: dark ? "#0a1428" : "#0f2744",
          padding: "0.5rem 1.5rem 1rem",
          display: "flex", flexDirection: "column", gap: "0.1rem",
        }}>
          {links.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: active === l ? "#f59e0b" : "rgba(255,255,255,0.85)",
              fontSize: "0.95rem", fontWeight: 500, textAlign: "left",
              padding: "0.7rem 0", borderBottom: "1px solid rgba(255,255,255,0.07)",
              fontFamily: "inherit",
            }}>
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
