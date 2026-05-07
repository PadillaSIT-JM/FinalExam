function Home() {
  return (
    <section style={{ padding: "48px 40px", borderBottom: "0.5px solid #36255b", background: "#b18bff" }}>
      <div style={{ display: "center", gap: "32px", alignItems: "center" 
      }}>
        
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", 
            justifyContent: "center", textAlign: "center", padding: "40px" }}>
            
            <img
                src="/src/assets/5433ad2c-8996-4dc1-b92a-488808a400be.jpg"  
                style={{
                width: 170,
                height: 170,
                borderRadius: "50%",
                objectFit: "cover",
                border: "0.5px solid #490066",
                marginBottom: 16,
                }}
            />

        
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 6, letterSpacing: 5,
           fontFamily: "Garamond (serif)" }}>
            Greetings! 
        </h1>
        <h2 style={{color: "#000000" }}>Searching for your next employee? Explore this portfolio to see why the search ends here. 
          Your ideal candidate is just one click, one call away.</h2>
       
        
        </div>
      </div>
    </section>
  );
}

export default Home;