import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRoom extends Document {
  pgId: Types.ObjectId;
  roomNo: string;
  floor: number;
  type: "Single" | "Double" | "Triple";
  rent: number;
  status: "vacant" | "occupied" | "to-be-vacant";
  tenantName?: string;
  expectedVacancyDate?: Date;
}

const roomSchema: Schema = new Schema({
  pgId: { type: Schema.Types.ObjectId, ref: "PG", required: true },
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

const Room = mongoose.model<IRoom>("Room", roomSchema);
export default Room;
