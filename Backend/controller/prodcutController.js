import mongoose from "mongoose";
import Product from "../model/productSchema.js";  // fixed typo: Product

// Create Product
export const createProduct = async (req, res) => {
  const { name, description, price, currency, stock_quantity, category, images, attributes } = req.body;

  // Basic validation
  if (!name || !price || !category || !category.name) {
    return res.status(400).json({ 
      message: "Missing required fields: name, price, and category.name are mandatory." 
    });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      currency,
      stock_quantity,
      category,
      images,
      attributes
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

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
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
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
}