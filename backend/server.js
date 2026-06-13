const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const projectRoutes = require("./routes/projectRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);


app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API WORKING 🚀",
  });
});

app.use("/api/auth", authRoutes);


app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});
app.use("/api/projects", projectRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});