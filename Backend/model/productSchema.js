import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  stock_quantity: { type: Number, default: 0 },

  // Embedded category info
  category: {
    name: { type: String, required: true },
    parent: { type: String, default: null } // optional nested category name
  },

  // Embedded brand info
  // (you can add brand fields here if needed)

  // Embedded images
  images: [
    {
      url: { type: String, required: true },
      alt_text: { type: String },
      is_primary: { type: Boolean, default: false }
    }
  ],

  // Embedded attributes
  attributes: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],

  is_active: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

export default Product;