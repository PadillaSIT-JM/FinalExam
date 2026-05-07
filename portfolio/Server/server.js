const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const app = express();

app.use(cors());
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

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, token: "Bearer admin-token" });
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

app.get("/admin/submissions", async (req, res) => {
  const token = req.headers.authorization;
  if (token !== "Bearer admin-token") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const data = await User.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/admin/submissions", async (req, res) => {
  const token = req.headers.authorization;
  if (token !== "Bearer admin-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/admin/submissions/:id", async (req, res) => {
  const token = req.headers.authorization;
  if (token !== "Bearer admin-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/admin/submissions/:id", async (req, res) => {
  const token = req.headers.authorization;
  if (token !== "Bearer admin-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose
  .connect("mongodb+srv://20253152_db_user:wPtg2ELVaOvwevaa@cluster0.bw4gecl.mongodb.net/aptech?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });