import mongoose from "mongoose";
import Product from "../model/productSchema.js";

// ==================== CREATE PRODUCT ====================
export const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    sale_price,
    category,
    images,
    colors, // <-- updated from variants
    is_active
  } = req.body;

  // Basic validation
  if (!name || !price || !category) {
    return res.status(400).json({
      message: "Missing required fields: name, price, and category are mandatory."
    });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      sale_price,
      category,
      images,
      colors, // <-- save the nested colors structure
      is_active: is_active !== undefined ? is_active : true
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== GET ALL PRODUCTS ====================
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, is_featured, search } = req.query;
    const query = {};

    if (category) query["category"] = category;
    if (is_featured) query["is_featured"] = is_featured === "true";
    if (search) query["name"] = { $regex: search, $options: "i" };

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({ total, page: Number(page), limit: Number(limit), products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== GET PRODUCT BY ID ====================
export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// ==================== UPDATE PRODUCT ====================
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    // Fetch existing product
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update top-level fields
    const fieldsToUpdate = ["name", "description", "price", "sale_price", "category", "images", "is_active"];
    fieldsToUpdate.forEach(field => {
      if (updateData[field] !== undefined) product[field] = updateData[field];
    });

    // Update colors safely
    if (updateData.colors && Array.isArray(updateData.colors)) {
      updateData.colors.forEach((colorUpdate) => {
        // Find existing color by name
        const existingColor = product.colors.find(c => c.color === colorUpdate.color);
        if (existingColor) {
          // Update images
          if (colorUpdate.images) existingColor.images = colorUpdate.images;

          // Update sizes
          if (colorUpdate.sizes) existingColor.sizes = colorUpdate.sizes;
        } else {
          // If color doesn't exist, push new one
          product.colors.push(colorUpdate);
        }
      });
    }

    const updatedProduct = await product.save();

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== DELETE PRODUCT ====================
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
 