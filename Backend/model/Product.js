// models/Product.js
const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  size: String,
  color: String,
  price: Number,
  stock: { type: Number, default: 0 },
  images: [String]
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, unique: true, sparse: true },
  shortDesc: String,
  longDesc: String,
  price: Number,
  discountPrice: Number,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  subcategory: { type: String },
  tags: [String],
  images: [String],
  variants: [VariantSchema],
  totalStock: { type: Number, default: 0 },
  status: { type: String, enum: ['active','draft','hidden'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
