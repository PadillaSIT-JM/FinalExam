const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const jwt = require("jsonwebtoken");
const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN || "https://finalexam-bo87.onrender.com",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

app.use(cors({ origin: (origin, callback) => { if (!origin || allowedOrigins.includes(origin)) { callback(null, true); } else { callback(new Error("CORS policy: Origin not allowed")); } }, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({ YourName: String, YourEmail: String, ContactNumber: String, SendMessage: String, confirmSubmit: Boolean });
const User = mongoose.model("portfolio", userSchema, "portfolio");

const verifyToken = (req, res, next) => { const authHeader = req.headers.authorization; if (!authHeader) return res.status(401).json({ message: "No token provided" }); const token = authHeader.split(" ")[1]; if (!token) return res.status(401).json({ message: "Invalid token format" }); try { const decoded = jwt.verify(token, process.env.JWT_SECRET); req.user = decoded; next(); } catch (error) { res.status(401).json({ message: "Invalid token" }); } };

app.post("/admin/login", async (req, res) => { try { const { username, password } = req.body; if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) { const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "24h" }); return res.json({ success: true, token }); } return res.status(401).json({ success: false, message: "Invalid credentials" }); } catch (err) { return res.status(500).json({ success: false, message: err.message }); } });

app.post("/feedback", async (req, res) => { try { const user = await User.create(req.body); return res.status(200).json({ success: true, message: "Form received!", user }); } catch (err) { return res.status(500).json({ error: err.message }); } });

app.get("/admin/submissions", verifyToken, async (req, res) => { try { const data = await User.find(); res.json(data); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post("/admin/submissions", verifyToken, async (req, res) => { try { const user = await User.create(req.body); res.json(user); } catch (err) { res.status(500).json({ error: err.message }); } });
app.put("/admin/submissions/:id", verifyToken, async (req, res) => { try { const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!updated) return res.status(404).json({ error: "Not found" }); return res.json(updated); } catch (err) { return res.status(500).json({ error: err.message }); } });
app.delete("/admin/submissions/:id", verifyToken, async (req, res) => { try { const deleted = await User.findByIdAndDelete(req.params.id); if (!deleted) return res.status(404).json({ error: "Not found" }); return res.json({ message: "Deleted successfully" }); } catch (err) { return res.status(500).json({ error: err.message }); } });

app.use((req, res) => { res.status(404).json({ error: "Route not found" }); });

mongoose.connect(process.env.MONGODB_URI).then(() => { console.log("Connected to MongoDB"); const port = process.env.PORT || 5000; app.listen(port, () => console.log(`Server running on port ${port}`)); }).catch((err) => { console.error("MongoDB connection failed:", err); process.exit(1); });
