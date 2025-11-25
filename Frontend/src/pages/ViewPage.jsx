import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function ProductViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/users/products/${id}`);
        const data = await res.json();

        if (res.status === 400) setError("Invalid product ID.");
        else if (res.status === 404) setError("Product not found.");
        else if (!res.ok) setError("Failed to load product. Please try again later.");
        else if (data?.product) {
          setProduct(data.product);
          setSelectedVariant(data.product.variants?.[0] || null);
        } else setError("Product data is empty.");
      } catch (err) {
        console.error(err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    const itemToAdd = selectedVariant || product;
    const maxStock = selectedVariant?.stock || product.stock_quantity;

    if (quantity < 1) return toast.error("Quantity must be at least 1");
    if (quantity > maxStock) return toast.error("Not enough stock available");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === itemToAdd._id);

    if (existing) {
      existing.quantity += quantity;
      cart = cart.map((item) => (item._id === itemToAdd._id ? existing : item));
    } else {
      cart.push({ ...itemToAdd, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${quantity} item(s) added to cart!`);
  };

  const submitReview = async () => {
    if (!reviewComment.trim()) return toast.error("Comment cannot be empty");
    setSubmittingReview(true);
    try {
      const res = await fetch(`http://localhost:8000/api/users/products/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });

      const data = await res.json();

      if (!res.ok) toast.error(data.message || "Failed to submit review");
      else {
        toast.success("Review submitted successfully!");
        setProduct((prev) => ({
          ...prev,
          reviews: [...prev.reviews, data.review],
          total_reviews: (prev.total_reviews || 0) + 1,
          average_rating:
            ((prev.average_rating || 0) * (prev.total_reviews || 0) + reviewRating) /
            ((prev.total_reviews || 0) + 1),
        }));
        setReviewComment("");
        setReviewRating(5);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review. Try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        {error}
        <div className="mt-4">
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Go to Home
          </button>
        </div>
      </div>
    );

  // Dynamic values based on selected variant
  const maxStock = selectedVariant?.stock || product.stock_quantity;
  const unitPrice = selectedVariant?.sale_price || product.sale_price || product.price;
  const originalUnitPrice = selectedVariant?.price || product.price;
  const isOnSale = unitPrice < originalUnitPrice;

  const discountAmountPerUnit = isOnSale ? originalUnitPrice - unitPrice : 0;
  const discountPercentPerUnit = isOnSale ? Math.round((discountAmountPerUnit / originalUnitPrice) * 100) : 0;

  const totalPrice = unitPrice * quantity;
  const totalOriginalPrice = originalUnitPrice * quantity;
  const totalDiscountAmount = discountAmountPerUnit * quantity;

  const primaryImage =
    selectedVariant?.images?.[0]?.url ||
    product.images?.[0]?.url ||
    "https://placehold.co/400x400?text=No+Image";

  const avgRating = product.average_rating || 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="w-full h-96 mb-4 relative">
            <img
              src={primaryImage}
              alt={product.name || "Product image"}
              className="w-full h-full object-cover rounded-lg shadow"
            />
            {isOnSale && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm font-bold rounded">
                -{discountPercentPerUnit}% OFF
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto mt-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.alt_text || product.name}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                    primaryImage === img.url ? "border-green-600" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedVariant((prev) => ({ ...prev, images: [img] }))}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <span className="flex">{renderStars(Math.round(avgRating))}</span>
            <span className="ml-2 text-gray-600 text-sm">
              ({product.total_reviews || 0} review{product.total_reviews === 1 ? "" : "s"})
            </span>
          </div>

          <p className="text-gray-700 mb-4">{product.description}</p>

          {/* Size / Variant Selector */}
          {product.variants?.length > 0 && (
            <div className="mb-4">
              <label className="font-semibold mr-2">Size:</label>
              <div className="flex flex-wrap gap-4 mt-1">
                {product.variants.map((variant) => {
                  const size = variant.attributes.find((a) => a.key === "size")?.value || "N/A";
                  const price = variant.price;
                  const sale = variant.sale_price;
                  const isVariantOnSale = sale && sale < price;
                  const variantDiscountAmount = isVariantOnSale ? price - sale : 0;
                  const variantDiscountPercent = isVariantOnSale ? Math.round((variantDiscountAmount / price) * 100) : 0;

                  return (
                    <div key={variant.sku} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          setSelectedVariant(variant);
                          setQuantity(1);
                        }}
                        className={`px-4 py-2 rounded border ${
                          selectedVariant?.sku === variant.sku
                            ? "border-green-600 bg-green-100"
                            : "border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                      {isVariantOnSale && (
                        <div className="text-red-500 text-xs mt-1 text-center">
                          -{variantDiscountPercent}% | ₹{variantDiscountAmount * quantity}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-4 flex items-center gap-2">
            <label className="font-semibold">Quantity:</label>
            <input
              type="number"
              min="1"
              max={maxStock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1"
            />
            <span className="text-gray-500">Max: {maxStock}</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-gray-500 mb-1">Unit Price: ₹{unitPrice.toLocaleString()}</p>
            {isOnSale && (
              <p className="text-red-500 text-sm mb-1">
                Discount: -₹{discountAmountPerUnit.toLocaleString()} ({discountPercentPerUnit}%)
              </p>
            )}
            <p className="text-green-600 font-bold text-2xl">
              Total: ₹{totalPrice.toLocaleString()}{" "}
              {isOnSale && (
                <span className="line-through text-gray-400 text-lg ml-2">
                  ₹{totalOriginalPrice.toLocaleString()}
                </span>
              )}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={addToCart}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Add to Cart
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {product.reviews?.length > 0 ? (
          <div className="space-y-4 mb-6">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{review.user_id || "Anonymous"}</span>
                  <span className="flex items-center">{renderStars(review.rating)}</span>
                </div>
                <p className="text-gray-700 mb-1">{review.comment}</p>
                <span className="text-gray-400 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-6">No reviews yet. Be the first to review this product!</p>
        )}

        {/* Submit Review */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Write a Review</h3>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Rating:</label>
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Comment:</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
              className="w-full border rounded px-2 py-1"
            ></textarea>
          </div>
          <button
            onClick={submitReview}
            disabled={submittingReview}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
