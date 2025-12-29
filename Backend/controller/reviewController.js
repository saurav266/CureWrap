// controllers/reviewController.js
import Product from "../model/productSchema.js";
import Order from "../model/orderSchema.js";

export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const user = req.user; // from auth middleware

  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating and comment required" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // ✅ Already reviewed?
    const already = product.reviews.find(
      (r) => r.user_id.toString() === user._id.toString()
    );
    if (already) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    // ✅ Check purchase (must be delivered)
    const hasPurchased = await Order.findOne({
      user: user._id,
      "items.product": productId,
      orderStatus: "delivered",
    });

    if (!hasPurchased) {
      return res
        .status(403)
        .json({ message: "Purchase required to review this product" });
    }

    const review = {
      user_id: user._id,
      name: user.name || user.email,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.total_reviews = product.reviews.length;
    product.average_rating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      review: product.reviews[product.reviews.length - 1],
      average_rating: product.average_rating,
      total_reviews: product.total_reviews,
    });
  } catch (err) {
    console.error("addReview error:", err);
    res.status(500).json({ message: "Failed to add review" });
  }
};

// ✏️ Edit review
export const updateReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { id: productId, reviewId } = req.params;
  const userId = req.user._id.toString();

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review)
      return res.status(404).json({ message: "Review not found" });

    if (review.user_id.toString() !== userId)
      return res.status(403).json({ message: "Not allowed" });

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    product.average_rating =
      product.reviews.reduce((s, r) => s + r.rating, 0) /
      product.reviews.length;

    await product.save();

    res.json({ success: true, review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update review" });
  }
};

// 🗑 Delete review
export const deleteReview = async (req, res) => {
  const { id: productId, reviewId } = req.params;
  const userId = req.user._id.toString();

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review)
      return res.status(404).json({ message: "Review not found" });

    if (review.user_id.toString() !== userId)
      return res.status(403).json({ message: "Not allowed" });

    review.deleteOne();

    product.total_reviews = product.reviews.length;
    product.average_rating = product.reviews.length
      ? product.reviews.reduce((s, r) => s + r.rating, 0) /
        product.reviews.length
      : 0;

    await product.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete review" });
  }
};
