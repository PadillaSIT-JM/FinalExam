interface Project {
  title: string;
  desc: string;
  link: string;
  image?: string;
}

const projects: Project[] = [
  {
    title: "Event-Dashboard",
    desc: "A dashboard for managing events.",
    link: "https://padillasit-jm.github.io/PadillaSIT-JM-MG_LAB4_PADILLA/",
  },
  {
    title: "Student Service Portal",
    desc: "A portal for students to access various services.",
    link: "https://padillasit-jm.github.io/MG_LAB_5PADILLA/?authuser=0"
  },
  {
    title: "Student Portal ",
    desc: "A portal for students to manage their academic information.",
    link: "https://padillasit-jm.github.io/student-portal/?authuser=0"
  },

 
];


function Projects() {
  return (
    <section style={{ padding: "170px 170px", borderBottom: "0.5px solid #3a00a4", background: "#9662fe" }}>
      <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24 }}>PROJECTS</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
        {projects.map((p) => (
          <div key={p.title} style={{ background: "#ddb4ff", border: "0.5px solid #730089", borderRadius: 12, padding: "1rem 1.25rem" }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 6, color: "#4706a7" }}>{p.title}</h3>
            <p style={{ fontSize: 13, color: "#4706a7", lineHeight: 1.6 }}>{p.desc}</p>
            {p.link !== "" && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  color: "#866dcb",
                  textDecoration: "none",
                  fontWeight: 500,
                  display: "inline-block",
                  marginTop: 8,
                  border: "0.5px solid #7d4dff",
                  padding: "3px 10px",
                  borderRadius: 6,
                }}
              >
                Check Project →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;