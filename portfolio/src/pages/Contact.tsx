import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { API_BASE } from "../utils/api";

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    YourName: "",
    YourEmail: "",
    ContactNumber: "",
    SendMessage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === "number" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started, API_BASE:", API_BASE);
    console.log("Form data:", formData);

    try {
      // 1. Save to MongoDB
      const res = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", res.status, "OK:", res.ok);

      if (!res.ok) {
        const errText = await res.text();
        console.error("Server error:", res.status, res.statusText, "Raw response:", errText);
        throw new Error(errText || `Server error: ${res.status}`);
      }

    
      const contentLength = res.headers.get("content-length");
      const contentType = res.headers.get("content-type") || "";
      const isEmptyBody = res.status === 204 || contentLength === "0";
      const isJson = contentType.includes("application/json");

      let message = "Form submitted successfully!";

      if (!isEmptyBody && isJson) {
        const text = await res.text();
        if (text) {
          const data = JSON.parse(text);
          console.log("Parsed data:", data);
          if (data.message) message = data.message;
        }
      }

      // 2. Send email via EmailJS
      await emailjs.sendForm(
        "service_t9fpon7",
        "template_maib9fa",
        formRef.current!,
        "i1oM4PfIynkEBV7iJ"
      );

      alert(message);
      setFormData({ YourName: "", YourEmail: "", ContactNumber: "", SendMessage: "" });
    } catch (error) {
      console.error("Full error:", error);
      alert(`Failed: ${error instanceof Error ? error.message : error}`);
    }
  };

  const inp: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: 14,
    borderRadius: 8,
    border: "0.5px solid #ddd",
    background: "#000000",
    width: "100%",
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#b18bff" }}>
      <div style={{ background: "#aa34ff", borderRadius: 16, padding: 40, width: "100%", maxWidth: 480, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <h2 style={{ textAlign: "center", marginBottom: 6 }}>CONTACT</h2>
        <p style={{ textAlign: "center", color: "#000000", fontSize: 14, marginBottom: 24 }}>
          Fill out the form and I'll get back to you.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input style={inp} type="text"   name="YourName"      placeholder="Full Name"      value={formData.YourName}      onChange={handleChange} required />
          <input style={inp} type="email"  name="YourEmail"     placeholder="Email Address"  value={formData.YourEmail}     onChange={handleChange} required />
          <input style={inp} type="number" name="ContactNumber" placeholder="Contact Number" value={formData.ContactNumber} onChange={handleChange} />
          <textarea style={{ ...inp, minHeight: 120, resize: "vertical" }} name="SendMessage" placeholder="Your message..." value={formData.SendMessage} onChange={handleChange} required />
          <button type="submit" style={{ padding: "11px", fontSize: 14, fontWeight: 500, borderRadius: 8, border: "none", background: "#360689", color: "#d2c0ff", cursor: "pointer" }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
