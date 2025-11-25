import mongoose from "mongoose";
import Product from "../model/productSchema.js";

// Create Product
export const createProduct = async (req, res) => {
  const {
    name,
    slug,
    description,
    short_description,
    price,
    sale_price,
    currency,
    stock_quantity,
    quantity,       // <-- Added quantity
    sku,
    category,
    brand,
    images,
    variants,
    attributes,
    shipping,
    seo,
    is_featured,
    is_active,
    seller
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
      slug,
      description,
      short_description,
      price,
      sale_price,
      currency,
      stock_quantity,
      quantity: quantity || stock_quantity, // fallback to stock_quantity
      sku,
      category,
      brand,
      images,
      variants,
      attributes,
      shipping,
      seo,
      is_featured: is_featured || false,
      is_active: is_active !== undefined ? is_active : true,
      seller
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get All Products with optional filtering, sorting, and pagination
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
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get Product by ID
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

// Delete Product
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
