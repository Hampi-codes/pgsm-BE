import express from "express";
import {
  loginAdmin,
  updateAdminPassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.post("/update-password", verifyToken, updateAdminPassword);

export default router;
