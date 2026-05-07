import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";

interface Submission {
  _id: string;
  YourName: string;
  YourEmail: string;
  ContactNumber: number;
  SendMessage: string;
}

const empty = { YourName: "", YourEmail: "", ContactNumber: 0, SendMessage: "" };

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState<{ [id: string]: string }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Omit<Submission, "_id">>(empty);
  const [showCreate, setShowCreate] = useState(false);
  const [newData, setNewData] = useState<Omit<Submission, "_id">>(empty);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const token = localStorage.getItem("admin-token") || "";

  const inp: React.CSSProperties = {
    padding: "8px 12px", fontSize: 13, borderRadius: 8,
    border: "0.5px solid #ddd", background: "#000", color: "#fff",
    width: "100%", fontFamily: "inherit", outline: "none", marginBottom: 8,
  };

  useEffect(() => {
    fetch("http://localhost:5000/admin/submissions", {
      headers: { Authorization: token },
    })
      .then(res => res.json())
      .then(data => setSubmissions(data))
      .catch(console.error);
  }, []);

  // CREATE
  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(newData),
      });
      const created = await res.json();
      setSubmissions(prev => [created, ...prev]);
      setNewData(empty);
      setShowCreate(false);
    } catch {
      alert("Create failed");
    }
  };

  // UPDATE
  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(editData),
      });
      const updated = await res.json();
      setSubmissions(prev => prev.map(s => s._id === id ? updated : s));
      setEditingId(null);
      setStatus(prev => ({ ...prev, [id]: "Updated!" }));
    } catch {
      setStatus(prev => ({ ...prev, [id]: "Update failed" }));
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      await fetch(`http://localhost:5000/admin/submissions/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      setSubmissions(prev => prev.filter(s => s._id !== id));
      setStatus(prev => ({ ...prev, [id]: "Deleted" }));
    } catch {
      setStatus(prev => ({ ...prev, [id]: "Delete failed" }));
    }
  };

  // REPLY via EmailJS
  const handleReply = async (s: Submission) => {
    if (!replyMessage.trim()) return alert("Please type a reply message.");
    try {
      await emailjs.send(
        "service_t9fpon7",
        "YOUR_REPLY_TEMPLATE_ID",   // ← create a new template in EmailJS for replies
        {
          to_email: s.YourEmail,
          to_name: s.YourName,
          reply_message: replyMessage,
        },
        "i1oM4PfIynkEBV7iJ"
      );
      setStatus(prev => ({ ...prev, [s._id]: "✅ Reply sent!" }));
      setReplyingId(null);
      setReplyMessage("");
    } catch {
      setStatus(prev => ({ ...prev, [s._id]: "❌ Reply failed" }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    onLogout();
  };

  return (
    <div style={{ padding: 40, background: "#d4beff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2>📋 Submissions ({submissions.length})</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowCreate(!showCreate)}
            style={{ padding: "8px 16px", borderRadius: 8, border: "none",
              background: "#360689", color: "#d2c0ff", cursor: "pointer" }}>
            ➕ Create
          </button>
          <button onClick={handleLogout}
            style={{ padding: "8px 16px", borderRadius: 8, border: "none",
              background: "#ff4d4d", color: "#9123ff", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      {/* CREATE FORM */}
      {showCreate && (
        <div style={{ background: "#f5ccf7", borderRadius: 12, padding: 20, marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <h3 style={{ marginBottom: 12 }}>➕ New Submission</h3>
          <input style={inp} placeholder="Full Name"      value={newData.YourName}      onChange={e => setNewData({ ...newData, YourName: e.target.value })} />
          <input style={inp} placeholder="Email Address"  value={newData.YourEmail}     onChange={e => setNewData({ ...newData, YourEmail: e.target.value })} />
          <input style={inp} placeholder="Contact Number" value={newData.ContactNumber} onChange={e => setNewData({ ...newData, ContactNumber: Number(e.target.value) })} type="number" />
          <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} placeholder="Message" value={newData.SendMessage} onChange={e => setNewData({ ...newData, SendMessage: e.target.value })} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleCreate}
              style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                background: "#360689", color: "#d2c0ff", cursor: "pointer", fontSize: 13 }}>
              ✅ Save
            </button>
            <button onClick={() => { setShowCreate(false); setNewData(empty); }}
              style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                background: "#aaa", color: "#fff", cursor: "pointer", fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* READ + UPDATE + DELETE + REPLY */}
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map(s => (
          <div key={s._id} style={{ background: "#f5ccf7", borderRadius: 12, padding: 20,
            marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>

            {editingId === s._id ? (
              // EDIT MODE
              <>
                <input style={inp} value={editData.YourName}      onChange={e => setEditData({ ...editData, YourName: e.target.value })} placeholder="Full Name" />
                <input style={inp} value={editData.YourEmail}     onChange={e => setEditData({ ...editData, YourEmail: e.target.value })} placeholder="Email" />
                <input style={inp} value={editData.ContactNumber} onChange={e => setEditData({ ...editData, ContactNumber: Number(e.target.value) })} placeholder="Contact" type="number" />
                <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} value={editData.SendMessage} onChange={e => setEditData({ ...editData, SendMessage: e.target.value })} placeholder="Message" />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => handleUpdate(s._id)}
                    style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                      background: "#360689", color: "#d2c0ff", cursor: "pointer", fontSize: 13 }}>
                    💾 Save
                  </button>
                  <button onClick={() => setEditingId(null)}
                    style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                      background: "#aaa", color: "#fff", cursor: "pointer", fontSize: 13 }}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              // VIEW MODE
              <>
                <p><strong>Name:</strong> {s.YourName}</p>
                <p><strong>Email:</strong> {s.YourEmail}</p>
                <p><strong>Contact:</strong> {s.ContactNumber}</p>
                <p><strong>Message:</strong> {s.SendMessage}</p>

                {status[s._id] && (
                  <p style={{ fontSize: 12, color: "red", marginTop: 4 }}>{status[s._id]}</p>
                )}

                {/* REPLY BOX */}
                {replyingId === s._id && (
                  <div style={{ marginTop: 12 }}>
                    <textarea
                      style={{ ...inp, minHeight: 80, resize: "vertical", color: "#fff" }}
                      placeholder={`Write your reply to ${s.YourName}...`}
                      value={replyMessage}
                      onChange={e => setReplyMessage(e.target.value)}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <button onClick={() => handleReply(s)}
                        style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                          background: "#360689", color: "#d2c0ff", cursor: "pointer", fontSize: 13 }}>
                        📨 Send Reply
                      </button>
                      <button onClick={() => { setReplyingId(null); setReplyMessage(""); }}
                        style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                          background: "#aaa", color: "#fff", cursor: "pointer", fontSize: 13 }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => { setReplyingId(s._id); setReplyMessage(""); }}
                    style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                      background: "#28a745", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                    💬 Reply
                  </button>
                  <button onClick={() => { setEditingId(s._id); setEditData({ YourName: s.YourName, YourEmail: s.YourEmail, ContactNumber: s.ContactNumber, SendMessage: s.SendMessage }); }}
                    style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                      background: "#4189c9", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(s._id)}
                    style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                      background: "#ff4d4d", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;