import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: "PG", required: true },
  roomNo: { type: String, required: true },
  floor: { type: Number, required: true },
  type: { type: String, enum: ["Single", "Double", "Triple"], required: true },
  rent: { type: Number, required: true },
  status: {
    type: String,
    enum: ["vacant", "occupied", "to-be-vacant"],
    default: "vacant",
  },
  tenantName: { type: String },
  expectedVacancyDate: { type: Date },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
