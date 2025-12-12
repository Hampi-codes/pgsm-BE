import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(">>>",user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const updateAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id; // Assumes you have a middleware adding `req.user`

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ msg: "Both current and new password are required" });
  }

  try {
    const admin = await User.findById(userId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(401).json({ msg: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
