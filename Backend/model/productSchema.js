import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  sku: String,
  attributes: [
    {
      key: String, // color, size
      value: String
    }
  ],
  price: Number,
  sale_price: Number,
  stock: Number, // variant stock
  quantity: Number, // optional additional field if you want to track quantity separately
  images: [
    {
      url: String,
      alt_text: String,
      is_primary: Boolean
    }
  ]
});

const ReviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number,
  comment: String,
  created_at: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    description: String,
    short_description: String,

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    brand: {
      name: String,
      logo: String
    },

    price: Number,
    sale_price: Number,
    currency: { type: String, default: "INR" },

    stock_quantity: Number, // total stock
    quantity: Number,       // current available quantity
    sku: String,

    images: [
      {
        url: String,
        alt_text: String,
        is_primary: Boolean
      }
    ],

    variants: [VariantSchema],

    attributes: [
      {
        key: String,
        value: String
      }
    ],

    shipping: {
      is_free: Boolean,
      charge: Number,
      estimated_days: Number
    },

    reviews: [ReviewSchema],
    average_rating: Number,
    total_reviews: Number,

    seo: {
      meta_title: String,
      meta_description: String,
      meta_keywords: [String]
    },

    is_featured: Boolean,
    is_active: { type: Boolean, default: true },

    views: Number,
    purchases: Number,

    seller: {
      seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
      store_name: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
