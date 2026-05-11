import express from "express";
import {
  getAllPGs,
  getPGById,
  createPG,
  updatePG,
  deletePG,
} from "../controllers/pgController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

//Public routes
router.get("/", getAllPGs);
router.get("/:id", getPGById);

//Private routes
router.post("/", verifyToken, upload.array("images", 10), createPG);
router.put("/:id", verifyToken, upload.array("newImages", 10), updatePG);
router.delete("/:id", verifyToken, deletePG);

export default router;
