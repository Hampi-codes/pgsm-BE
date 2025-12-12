import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ username: "admin" });
    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
