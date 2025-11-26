import mongoose from "mongoose";

// Size schema
const SizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: Number,
  sale_price: Number,
  stock: Number,
  quantity: Number
});

// Color schema
const ColorSchema = new mongoose.Schema({
  color: { type: String, required: true },
  images: [
    {
      url: String,
      alt_text: String,
      is_primary: Boolean
    }
  ],
  sizes: [SizeSchema] // multiple sizes per color
});

// Main product schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: String,
    price: Number,
    sale_price: Number,
    images: [
      {
        url: String,
        alt_text: String,
        is_primary: Boolean
      }
    ],
    colors: [ColorSchema], // <-- updated field
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
