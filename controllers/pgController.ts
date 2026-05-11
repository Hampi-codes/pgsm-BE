import { Request, Response } from "express";
import PG from "../models/PG.js";
import cloudinary from "../config/cloudinary.js";

interface CloudinaryUploadResult {
  secure_url: string;
}

async function uploadImagesToCloudinary(files: Express.Multer.File[]): Promise<string[]> {
  const urls = await Promise.all(
    files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error: any, result: any) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                return reject(error);
              }
              resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        })
    )
  );
  return urls;
}

export const getAllPGs = async (req: Request, res: Response) => {
  try {
    const { pgTypes, amenities, sortBy, availability } = req.query;

    const mongoFilter: any = {};

    if (pgTypes) {
      const typesArray = String(pgTypes)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (typesArray.length) {
        mongoFilter.type = { $in: typesArray };
      }
    }

    if (amenities) {
      const amenitiesArray = String(amenities)
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      if (amenitiesArray.length) {
        mongoFilter.amenities = { $all: amenitiesArray };
      }
    }

    if (availability === "available") {
      mongoFilter.soldOut = false;
    } else if (availability === "sold-out") {
      mongoFilter.soldOut = true;
    }

    const mongoSort: any = {};
    if (sortBy === "price-low") {
      mongoSort.startingRent = 1;
    } else if (sortBy === "price-high") {
      mongoSort.startingRent = -1;
    }

    const pgs = await PG.find(mongoFilter).sort(mongoSort);
    res.json(pgs);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getPGById = async (req: Request, res: Response) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });
    res.json(pg);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createPG = async (req: Request, res: Response) => {
  try {
    const existing = await PG.findOne({ name: req.body.name });
    if (existing) {
      return res
        .status(400)
        .json({ message: "PG with this name already exists" });
    }

    let imageUrls: string[] = [];
    const files = req.files as Express.Multer.File[];
    if (files?.length) {
      imageUrls = await uploadImagesToCloudinary(files);
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];
    }

    const pg = new PG({ ...req.body, images: imageUrls });
    const saved = await pg.save();

    res.status(201).json({
      success: true,
      message: "PG created successfully",
      data: saved,
    });
  } catch (err: any) {
    console.error("Error in createPG:", err);
    res.status(400).json({
      success: false,
      message: "Failed to create PG",
      error: err.message,
    });
  }
};

export const updatePG = async (req: Request, res: Response) => {
  try {
    const existingPG = await PG.findById(req.params.id);
    if (!existingPG) {
      return res.status(404).json({
        success: false,
        message: "PG not found",
      });
    }

    let imageUrls: string[] = [];

    if (req.body.existingImages) {
      const existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
      imageUrls.push(...existingImages);
    }

    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      const newImageUrls = await uploadImagesToCloudinary(files);
      imageUrls.push(...newImageUrls);
    }

    const updateData = { ...req.body };
    delete updateData.existingImages;
    delete updateData.newImages;
    updateData.images = imageUrls;

    const updated = await PG.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "PG not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "PG updated successfully",
      data: updated,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "Failed to update PG",
      error: err.message,
    });
  }
};

export const deletePG = async (req: Request, res: Response) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({
        success: false,
        message: "PG not found",
      });
    }

    await PG.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "PG deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete PG",
      error: err.message,
    });
  }
};
