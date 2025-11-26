// src/pages/ProductViewPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function ProductViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ------------------------------
  // STATE
  // ------------------------------
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  const [touchStartX, setTouchStartX] = useState(null); // swipe
  const [related, setRelated] = useState([]);

  // AUTH & PURCHASE STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  const backendUrl = "http://localhost:8000";
  const FALLBACK_IMAGE = "/mnt/data/yoga-2587066_1280.jpg";

  // ------------------------------
  // IMAGE HELPER
  // ------------------------------
  const getImageUrl = (img) => {
    if (!img?.url) return FALLBACK_IMAGE;
    return img.url.startsWith("http")
      ? img.url
      : `${backendUrl}/${img.url.replace(/^\/+/, "")}`;
  };

  // ------------------------------
  // FETCH PRODUCT + RELATED
  // ------------------------------
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/api/users/products/${id}`);
        const data = await res.json();

        if (!res.ok || !data?.product) {
          setError(data?.message || "Product not found");
          setProduct(null);
        } else {
          const p = data.product;
          setProduct(p);

          // Default colour & size selection
          if (Array.isArray(p.colors) && p.colors.length > 0) {
            setSelectedColorIndex(0);
            const firstColor = p.colors[0];
            if (Array.isArray(firstColor.sizes) && firstColor.sizes.length > 0) {
              setSelectedVariant(firstColor.sizes[0]);
            } else {
              setSelectedVariant(null);
            }
          } else if (Array.isArray(p.variants) && p.variants.length > 0) {
            setSelectedVariant(p.variants[0]);
          } else {
            setSelectedVariant(null);
          }

          setGalleryIndex(0);
        }

        // Related products
        try {
          const relRes = await fetch(`${backendUrl}/api/users/products?limit=4`);
          const relData = await relRes.json();
          const arr = Array.isArray(relData.products)
            ? relData.products.filter((p) => p._id !== id).slice(0, 4)
            : [];
          setRelated(arr);
        } catch (e) {
          setRelated([]);
        }

        // AUTH CHECK
        const token = localStorage.getItem("user");
        setIsLoggedIn(!!token);

        // PURCHASE CHECK
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const purchased = orders.some((order) =>
          order.items?.some((item) => item.productId === id)
        );
        setHasPurchased(purchased);
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ------------------------------
  // COLOR & VARIANT DERIVED DATA
  // ------------------------------
  const selectedColor = useMemo(
    () => product?.colors?.[selectedColorIndex] || null,
    [product, selectedColorIndex]
  );

  const sizeOptions = useMemo(() => {
    if (selectedColor?.sizes?.length) return selectedColor.sizes;
    if (product?.variants?.length) return product.variants;
    return [];
  }, [selectedColor, product]);

  // ------------------------------
  // MAIN IMAGE SLIDER (product.images ONLY)
  // ------------------------------
  const images = product?.images || [];

  const primaryImageObj = images[galleryIndex] || images[0] || null;
  const primaryImage = getImageUrl(primaryImageObj);

  const handleNextImage = () => {
    if (!images.length) return;
    setGalleryIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    if (!images.length) return;
    setGalleryIndex((prev) =>
      prev - 1 < 0 ? images.length - 1 : prev - 1
    );
  };

  // Reset slider when product changes
  useEffect(() => {
    setGalleryIndex(0);
  }, [id]);

  // Autoplay slider
  useEffect(() => {
    if (!images.length || images.length === 1) return;
    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  // Swipe handlers (mobile)
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    const threshold = 50; // min swipe distance
    if (diff > threshold) {
      handlePrevImage();
    } else if (diff < -threshold) {
      handleNextImage();
    }
    setTouchStartX(null);
  };

  // ------------------------------
  // PRICE & STOCK CALCULATION
  // ------------------------------
  const displayPrice =
    selectedVariant?.sale_price ?? product?.sale_price ?? product?.price ?? 0;

  const originalPrice =
    selectedVariant?.price ?? product?.price ?? displayPrice;

  const isOnSale = displayPrice < originalPrice;
  const discountPercent = isOnSale
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  const totalPrice = displayPrice * quantity;
  const totalOriginalPrice = originalPrice * quantity;

  const maxStock = selectedVariant?.stock ?? product?.stock_quantity ?? 10;

  const hasColourSizeOptions =
    (product?.colors && product.colors.length > 0) ||
    (product?.variants && product.variants.length > 0);

  const canBuy = !hasColourSizeOptions || !!selectedVariant;

  // ------------------------------
  // ADD TO CART
  // ------------------------------
  const addToCart = () => {
    if (hasColourSizeOptions && !selectedVariant) {
      toast.error("Please select a size first.");
      return;
    }

    const item = selectedVariant || product;
    if (!item) return toast.error("No product selected.");

    if (quantity < 1) return toast.error("Quantity must be at least 1");
    if (quantity > maxStock) return toast.error("Not enough stock");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      (i) =>
        i.productId === product._id &&
        i.size === item.size &&
        i.color === (selectedColor?.color || i.color)
    );

    if (existing) {
      existing.quantity += quantity;
      cart = cart.map((i) =>
        i.productId === product._id &&
        i.size === item.size &&
        i.color === selectedColor?.color
          ? existing
          : i
      );
    } else {
      cart.push({
        ...item,
        productId: product._id,
        color: selectedColor?.color || item.color,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart!");
  };

  // ------------------------------
  // SUBMIT REVIEW
  // ------------------------------
  const submitReview = async () => {
    if (!reviewComment.trim()) return toast.error("Comment required");

    setSubmittingReview(true);
    try {
      const res = await fetch(
        `${backendUrl}/api/users/products/${id}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: reviewRating,
            comment: reviewComment,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Review failed");
      } else {
        toast.success("Review submitted");
        setProduct((prev) => ({
          ...prev,
          reviews: [...(prev.reviews || []), data.review],
          total_reviews: (prev.total_reviews || 0) + 1,
        }));
        setReviewComment("");
        setReviewRating(5);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // ------------------------------
  // STARS COMPONENT
  // ------------------------------
  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xl ${i < (rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ));

  // ------------------------------
  // LOADING OR ERROR UI
  // ------------------------------
  if (loading) {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <div className="h-12 w-12 animate-spin border-t-4 border-green-600 rounded-full" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg"
        >
          Return Home
        </button>
      </div>
    );
  }

  // ------------------------------
  // PAGE UI
  // ------------------------------
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster position="top-right" />

      {/* GALLERY + BUY AREA */}
      <div className="grid lg:grid-cols-12 gap-10">
        {/* LEFT: Gallery */}
        <div className="lg:col-span-7">
          <div className="relative bg-white rounded-xl overflow-hidden">
            {isOnSale && (
              <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm shadow z-10">
                {discountPercent}% OFF
              </div>
            )}

            {/* MAIN IMAGE SLIDER ONLY */}
            <div
              className="relative w-full h-[500px] bg-gray-100 overflow-hidden grid place-items-center"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 grid place-items-center shadow"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 grid place-items-center shadow"
                  >
                    ›
                  </button>
                </>
              )}

              <motion.img
                key={galleryIndex}
                src={primaryImage}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  zoom ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          </div>

          {/* DOT INDICATORS */}
          {images.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {images.map((img, idx) => (
                <button
                  key={img._id || idx}
                  onClick={() => setGalleryIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    galleryIndex === idx
                      ? "bg-green-600 scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Details & Buy Panel */}
        <div className="lg:col-span-5 sticky top-24 self-start">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex">{renderStars(product.average_rating || 0)}</div>
            <span className="text-gray-600 text-sm">
              ({product.total_reviews || 0} reviews)
            </span>
          </div>

          {/* Selected colour & size summary */}
          <div className="mt-2 text-sm text-gray-600 space-x-3">
            {selectedColor && (
              <span>
                Colour: <span className="font-semibold">{selectedColor.color}</span>
              </span>
            )}
            {selectedVariant?.size && (
              <span>
                Size: <span className="font-semibold">{selectedVariant.size}</span>
              </span>
            )}
          </div>

          {/* Short Description */}
          {/* <p className="mt-4 text-gray-700 leading-relaxed">
            {product.short_description || product.description}
          </p> */}

          {/* COLOR SELECTOR */}
          {product.colors?.length > 0 && (
            <div className="mt-6">
              <span className="font-semibold text-sm">Choose Colour</span>
              <div className="flex flex-wrap gap-3 mt-2">
                {product.colors.map((c, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedColorIndex(index);
                      const col = product.colors[index];
                      if (col?.sizes?.length) {
                        setSelectedVariant(col.sizes[0]);
                      } else {
                        setSelectedVariant(null);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedColorIndex === index
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {c.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR */}
          {sizeOptions.length > 0 && (
            <div className="mt-6">
              <span className="font-semibold text-sm">Choose Size</span>
              <div className="flex flex-wrap gap-3 mt-2">
                {sizeOptions.map((v, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedVariant?.size === v.size
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="mt-6">
            <span className="font-semibold text-sm">Quantity</span>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 border border-gray-300 rounded grid place-items-center"
              >
                −
              </button>

              <input
                type="number"
                min="1"
                max={maxStock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(1, Math.min(maxStock, Number(e.target.value)))
                  )
                }
                className="w-16 border rounded text-center"
              />

              <button
                onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                className="w-9 h-9 border border-gray-300 rounded grid place-items-center"
              >
                +
              </button>
            </div>

            <div className="mt-1 text-xs text-gray-500">
              {maxStock > 0 ? `In stock: ${maxStock}` : "Out of stock"}
            </div>
          </div>

          {/* Price Card */}
          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-green-600">
                ₹{totalPrice.toLocaleString()}
              </span>
              {isOnSale && (
                <span className="line-through text-gray-400">
                  ₹{totalOriginalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={addToCart}
                disabled={!canBuy}
                className={`flex-1 py-3 rounded-lg font-semibold ${
                  canBuy
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {canBuy ? "Add to Cart" : "Select size first"}
              </button>
              <button
                onClick={() => {
                  if (!canBuy) return;
                  addToCart();
                  navigate("/checkout");
                }}
                disabled={!canBuy}
                className={`flex-1 py-3 border rounded-lg font-semibold ${
                  canBuy
                    ? "border-gray-300 hover:bg-gray-50"
                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULL DESCRIPTION SECTION */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {product.description ||
            "No detailed description provided for this product."}
        </p>
      </div>

      {/* REVIEWS */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {product.reviews?.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((r, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{r.user_id || "User"}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(r.rating)}</div>
                    <span className="text-gray-500 text-sm">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {/* WRITE REVIEW */}
      <div className="mt-12 border rounded-lg p-6 bg-white">
        {!isLoggedIn && (
          <p className="text-gray-600">
            ⭐{" "}
            <span className="font-semibold text-red-500">Login required</span>{" "}
            to write a review.
          </p>
        )}

        {isLoggedIn && !hasPurchased && (
          <p className="text-gray-600">
            ⭐ You can review this product only after{" "}
            <span className="font-semibold text-blue-600">purchasing</span> it.
          </p>
        )}

        {isLoggedIn && hasPurchased && (
          <>
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

            <label className="block text-sm mb-2 font-medium">Rating</label>
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 mb-3"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && "s"}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-2 font-medium">Comment</label>
            <textarea
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <button
              onClick={submitReview}
              disabled={submittingReview}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </>
        )}
      </div>

      {/* RELATED PRODUCTS */}
      {related?.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/product/${r._id}`)}
                className="cursor-pointer border rounded-lg shadow-sm hover:shadow-md transition p-3"
              >
                <div className="w-full h-40 overflow-hidden rounded-lg mb-3">
                  <img
                    src={getImageUrl(r.images?.[0])}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                <p className="text-green-700 font-bold text-sm">
                  ₹{(r.sale_price || r.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
