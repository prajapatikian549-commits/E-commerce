import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Footer from "./components/Footer";

export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("theme") === "dark"; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
    document.body.style.background = dark ? "#0a1220" : "#f0f4f8";
  }, [dark]);

  const toggleDark = () => setDark(d => !d);

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", minHeight: "100vh", transition: "background 0.3s" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background-image: radial-gradient(circle, ${dark ? "#1e3a5f" : "#b0bec5"} 1px, transparent 1px);
          background-size: 28px 28px;
          transition: background 0.3s;
        }
        @keyframes avatarFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes eyeBlink   { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.08)} }
        @keyframes cursorBlink{ 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes screenGlow { 0%,100%{opacity:.65} 50%{opacity:1} }
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes particleFloat {
          0%,100%{transform:translateY(0) scale(1);opacity:0.7}
          50%{transform:translateY(-18px) scale(1.2);opacity:1}
        }
        .hero-inner  { display:grid; grid-template-columns:auto 1fr; align-items:center; gap:3.5rem; }
        .nav-links   { display:flex; }
        .hamburger   { display:none; }
        @media(max-width:820px){
          .hero-inner { grid-template-columns:1fr; text-align:center; gap:2rem; }
          .hero-inner > *:first-child { margin:0 auto; }
        }
        @media(max-width:640px){
          .nav-links  { display:none; }
          .hamburger  { display:block !important; }
        }
        button { font-family:inherit; }
        a:focus-visible, button:focus-visible { outline:2px solid #f59e0b; outline-offset:2px; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${dark?"#334155":"#94a3b8"}; border-radius:3px; }
      `}</style>

      <Nav dark={dark} toggleDark={toggleDark} />
      <Hero dark={dark} />
      <About dark={dark} />
      <Skills dark={dark} />
      <Experience dark={dark} />
      <Projects dark={dark} />
      <Education dark={dark} />
      <Footer dark={dark} />
    </div>
  );
}
