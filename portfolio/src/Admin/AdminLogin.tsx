import { useState } from "react";

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const text = await res.text();
      if (!res.ok) {
        console.error("Login failed:", res.status, res.statusText, "Raw body:", text);
        setError(text || "Server error");
        return;
      }
      if (!text) {
        setError("Empty response from server");
        return;
      }

      const data = JSON.parse(text);
      if (data.success) {
        localStorage.setItem("token", data.token); // save token
        onLogin();
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login exception:", error);
      setError(error instanceof Error ? error.message : "Server error");
    }
  };

  const inp: React.CSSProperties = {
    padding: "10px 14px", fontSize: 14, borderRadius: 8,
    border: "0.5px solid #ddd", background: "#000",
    width: "100%", fontFamily: "inherit", outline: "none", color: "#fff"
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#b18bff" }}>
      <div style={{ background: "#aa34ff", borderRadius: 16, padding: 40,
        width: "100%", maxWidth: 400 }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Admin Login</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input style={inp} type="text" placeholder="Username"
            value={credentials.username}
            onChange={e => setCredentials({ ...credentials, username: e.target.value })} />
          <input style={inp} type="password" placeholder="Password"
            value={credentials.password}
            onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
          <button type="submit" style={{ padding: 11, borderRadius: 8, border: "none",
            background: "#4189c9", color: "#fff", cursor: "pointer", fontSize: 14 }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;