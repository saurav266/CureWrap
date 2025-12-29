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

// Review schema
const ReviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true }, // snapshot
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 500,
    },
    verified: {
      type: Boolean,
      default: false, // set true if user bought product
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);



// Main product schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: String,
    price: Number,
    sale_price: Number,
    reviews: [ReviewSchema],
    average_rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
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
