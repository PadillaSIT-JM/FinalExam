function About() {
  return (
    <section style={{ padding: "75px 85px", borderBottom: "0.5px solid #e881ff", background: "#b18bff"}}>
      <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24 }}>ABOUT ME</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          {[
            ["Name",   "John Mark Untalan Padilla"],       // ← Replace
            ["IT Skills", "Web Designer, UI/UX Designer, Frontend Developer, Backend Developer, and Multimedia Artist"],           
            ["Education", "Bachelor of Science in Information Technology, University of Baguio(2026-2028)"], 
            ["Experience", "Internship at the Baguio City Prosecutor's Office as a Computer Technician (2024), Media Team at Baguio ABJ (2025), Technical Support (2025)"],
            ["Awards", "Best in Web Design (2024), Best in Multimedia Arts (2025), Best in Interactive Media (2025), and Graduate with Latin Honors (2028)"], 
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", gap: 12, padding: "10px 0",
              borderBottom: "0.5px solid #240d2d", fontSize: 14,   }}>
              <span style={{ color: "#380060", minWidth: 100 }}>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 14, color: "#ffffff", lineHeight: 1.8, background: "#b18bff", padding: 16, borderRadius: 8, border: "5px solid #aa34ff", marginTop: 40  }}>
          I’m a determined, academically successful student with a history of achievement and seeking and 
          reaching a position at your company as a IT professional. I gained various 
          achievement during my high school and college. Yearning to apply
           my skills and capabilities as well as to obtained valuable experience in a vigorous environment. {/* ← Replace */}
          
        </p>
   

      </div>
    </section>
  );
}

export default About;