import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
// Route imports
import authRoutes from "./routes/authRoutes.js";
import pgRoutes from "./routes/pgRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());               // Enable CORS
app.use(express.json());       // Parse JSON request bodies

// Health check endpoint
app.get("/", (req, res) => {
  res.send("🏠 PG API running...");
});

// API routes
app.use("/api/auth", authRoutes);   // Admin login/signup routes
app.use("/api/pgs", pgRoutes);      // PGs CRUD
app.use("/api/rooms", roomRoutes);  // Room CRUD

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
