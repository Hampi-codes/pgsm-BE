import mongoose, { Schema, Document } from "mongoose";

export interface IPG extends Document {
  name: string;
  location: string;
  type: "Boys" | "Girls" | "Co-ed";
  description: string;
  floors: number;
  startingRent?: number;
  amenities: string[];
  images: string[];
  soldOut: boolean;
  createdAt: Date;
}

const pgSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ["Boys", "Girls", "Co-ed"], required: true },
  description: { type: String, required: true },
  floors: { type: Number, required: true },
  startingRent: { type: Number },
  amenities: [String], // e.g., ['Wi-Fi', 'Food', 'AC']
  images: [String],
  soldOut: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const PG = mongoose.model<IPG>("PG", pgSchema);
export default PG;