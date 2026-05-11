import express from "express";
import {
  getRoomsByPG,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:pgId", getRoomsByPG);
router.post("/", verifyToken, createRoom);
router.put("/:id", verifyToken, updateRoom);
router.delete("/:id", verifyToken, deleteRoom);

export default router;
