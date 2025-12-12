import PG from "../models/PG.js";
import cloudinary from "../config/cloudinary.js";

async function uploadImagesToCloudinary(files) {
  const urls = await Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                return reject(error); // ✅ don't throw, reject instead
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

export const getAllPGs = async (req, res) => {
  try {
    const { pgTypes, amenities, sortBy, availability } = req.query;

    // Build Mongo filter
    const mongoFilter = {};

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

    // Availability filter
    if (availability === "available") {
      mongoFilter.soldOut = false;
    } else if (availability === "sold-out") {
      mongoFilter.soldOut = true;
    }
    // If no availability specified, don't filter by availability

    // Build sort
    const mongoSort = {};
    if (sortBy === "price-low") {
      mongoSort.startingRent = 1;
    } else if (sortBy === "price-high") {
      mongoSort.startingRent = -1;
    }

    const pgs = await PG.find(mongoFilter).sort(mongoSort);
    res.json(pgs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getPGById = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });
    res.json(pg);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createPG = async (req, res) => {
  try {
    const existing = await PG.findOne({ name: req.body.name });
    if (existing) {
      return res
        .status(400)
        .json({ message: "PG with this name already exists" });
    }

    let imageUrls = [];
    if (req.files?.length) {
      imageUrls = await uploadImagesToCloudinary(req.files);
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
  } catch (err) {
    console.error("Error in createPG:", err);
    res.status(400).json({
      success: false,
      message: "Failed to create PG",
      error: err.message,
    });
  }
};

export const updatePG = async (req, res) => {
  try {
    // Check if PG exists
    const existingPG = await PG.findById(req.params.id);
    if (!existingPG) {
      return res.status(404).json({
        success: false,
        message: "PG not found",
      });
    }

    let imageUrls = [];

    // Handle existing images (URLs)
    if (req.body.existingImages) {
      const existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
      imageUrls.push(...existingImages);
    }

    // Handle new images (files)
    if (req.files && req.files.length > 0) {
      const newImageUrls = await uploadImagesToCloudinary(req.files);
      imageUrls.push(...newImageUrls);
    }

    const updateData = { ...req.body };
    // Remove the existingImages field from updateData since we've processed it
    delete updateData.existingImages;
    delete updateData.newImages;

    // Set the combined images array
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
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update PG",
      error: err.message,
    });
  }
};

export const deletePG = async (req, res) => {
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete PG",
      error: err.message,
    });
  }
};
