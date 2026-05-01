import { personal } from "../data/portfolio";

export default function Footer({ dark }) {
  return (
    <footer style={{
      background: dark ? "#050d1a" : "#0f2744",
      color: "rgba(255,255,255,0.65)",
      textAlign: "center", padding: "2rem 1.5rem",
      fontSize: "0.83rem", marginTop: "2rem",
    }}>
      <strong style={{ color: "#fff" }}>{personal.name}</strong> · Software Engineer
      <div style={{ marginTop: "0.4rem" }}>
        <a href={`mailto:${personal.email}`} style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>{personal.email}</a>
        {" · "}
        <a href={`tel:${personal.phone}`} style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>{personal.phone}</a>
      </div>
      <div style={{ marginTop: "0.6rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
        Built with React ⚡ · {new Date().getFullYear()}
      </div>
    </footer>
  );
}
