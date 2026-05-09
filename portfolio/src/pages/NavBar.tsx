import  { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function NavBar() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "WEELCOME TO MY PORTFOLIO";

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Adjust speed here (100ms)

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <nav style={{ 
      display: "flex", 
      gap: "24px", 
      padding: "16px 40px", 
      borderBottom: "0.5px solid #da7dfc", 
      justifyContent: "space-between", 
      alignItems: "center" 
    }}>
      <span style={{ fontWeight: 500, color: "#0000ff" }}>
        {displayedText}
        <span className="cursor">|</span>
      </span>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "#07908c4" }}>Home</Link>
        <Link to="/about" style={{ color: "#07908c4" }}>About</Link>
        <Link to="/projects" style={{ color: "#07908c4" }}>Projects</Link>
        <Link to="/contact" style={{ color: "#07908c4" }}>Contact</Link>
      </div>
    </nav>
  );
}

export default NavBar;