const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");
const upload = require("./middleware/upload");

const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent
} = require("./controllers/studentController");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded student photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

// Home Route
app.get("/", (req, res) => {
    res.send("Digital ID Card Backend is Running!");
});

// Student API Routes
app.post("/api/students", upload.single("photo"), createStudent);
app.get("/api/students", getStudents);
app.put("/api/students/:id", upload.single("photo"), updateStudent);
app.delete("/api/students/:id", deleteStudent);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});