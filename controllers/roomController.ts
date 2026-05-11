import { Request, Response } from "express";
import Room from "../models/Room.js";
import PG from "../models/PG.js";
import { Types } from "mongoose";

// Helper to update soldOut status for a PG
async function updatePGSoldOutStatus(pgId: Types.ObjectId | string): Promise<void> {
  const rooms = await Room.find({ pgId });
  if (rooms.length === 0) {
    // No rooms, not sold out
    await PG.findByIdAndUpdate(pgId, { soldOut: false });
    return;
  }
  const allOccupied = rooms.every((room) => room.status === "occupied");
  await PG.findByIdAndUpdate(pgId, { soldOut: allOccupied });
}

export const getRoomsByPG = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find({ pgId: req.params.pgId }).sort({
      floor: 1,
      roomNo: 1,
    });
    res.json(rooms);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch rooms", error: err.message });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const room = new Room(req.body);
    const saved = await room.save();
    await updatePGSoldOutStatus(saved.pgId);
    res.status(201).json(saved);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Failed to create room", error: err.message });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updated) {
      await updatePGSoldOutStatus(updated.pgId);
    }
    res.json(updated);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Failed to update room", error: err.message });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    await Room.findByIdAndDelete(req.params.id);
    await updatePGSoldOutStatus(room.pgId);
    res.json({ message: "Room deleted successfully" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to delete room", error: err.message });
  }
};
