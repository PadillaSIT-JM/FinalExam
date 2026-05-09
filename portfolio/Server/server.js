const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const jwt = require("jsonwebtoken");
const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN || 'https://finalexam-bo87.onrender.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

const userSchema = new mongoose.Schema({
  YourName: String,
  YourEmail: String,
  ContactNumber: String,
  SendMessage: String,
  confirmSubmit: Boolean,
});

const User = mongoose.model("portfolio", userSchema, "portfolio");

function sendEmailJS(templateParams) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      service_id: 'service_t9fpon7',
      template_id: 'template_maib9fa',
      user_id: 'i1oM4PfIynkEBV7iJ',
      template_params: templateParams,
    });

    const options = {
      hostname: 'api.emailjs.com',
      path: '/api/v1.0/email/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`EmailJS error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const ADMIN_USERNAME = "Jm Padilla";
const ADMIN_PASSWORD = "Padilla4114";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1]; // Remove 'Bearer ' prefix
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || "your_secret_key", { expiresIn: "24h" });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/feedback", async (req, res) => {
  console.log("POST /feedback body:", req.body);

  try {
    const user = await User.create(req.body);

    try {
      const emailResult = await sendEmailJS({
        from_name: req.body.YourName,
        from_email: req.body.YourEmail,
        message: req.body.SendMessage,
      });
      console.log("Email sent:", emailResult);
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    res.json({ message: "Portfolio Contacts submitted successfully", user });
  } catch (err) {
    console.error("Error saving portfolio contacts:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/admin/submissions", verifyToken, async (req, res) => {
  try {
    const data = await User.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/admin/submissions", verifyToken, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/admin/submissions/:id", verifyToken, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/admin/submissions/:id", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://20253152_db_user:wPtg2ELVaOvwevaa@cluster0.bw4gecl.mongodb.net/aptech?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to MongoDB");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });