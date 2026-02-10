const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/alumni", require("./routes/alumniRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/mentorship", require("./routes/mentorshipRoutes"));

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Alumni Management System API",
    version: "1.0.0",
    status: "Running ",
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    ` Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
