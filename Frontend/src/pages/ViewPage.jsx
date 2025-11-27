// src/pages/ProductViewPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function ProductViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [touchStartX, setTouchStartX] = useState(null);
  const [related, setRelated] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  const [showDescription, setShowDescription] = useState(false);
  const [showOffers, setShowOffers] = useState(false);

  const backendUrl = "http://localhost:8000";
  const FALLBACK_IMAGE = "/mnt/data/yoga-2587066_1280.jpg";

  const getImageUrl = (img) => {
    if (!img?.url) return FALLBACK_IMAGE;
    return img.url.startsWith("http")
      ? img.url
      : `${backendUrl}/${img.url.replace(/^\/+/, "")}`;
  };

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

          if (Array.isArray(p.colors) && p.colors.length > 0) {
            setSelectedColorIndex(0);
            const firstColor = p.colors[0];
            setSelectedVariant(firstColor.sizes?.[0] || null);
          } else if (Array.isArray(p.variants) && p.variants.length > 0) {
            setSelectedVariant(p.variants[0]);
          }
        }

        const relRes = await fetch(`${backendUrl}/api/users/products?limit=4`);
        const relData = await relRes.json();
        const arr = Array.isArray(relData.products)
          ? relData.products.filter((p) => p._id !== id).slice(0, 4)
          : [];
        setRelated(arr);

        const token = localStorage.getItem("user");
        setIsLoggedIn(!!token);

        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const purchased = orders.some((o) =>
          o.items?.some((i) => i.productId === id)
        );
        setHasPurchased(purchased);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const selectedColor = useMemo(
    () => product?.colors?.[selectedColorIndex] || null,
    [product, selectedColorIndex]
  );

  const sizeOptions = useMemo(() => {
    if (selectedColor?.sizes?.length) return selectedColor.sizes;
    if (product?.variants?.length) return product.variants;
    return [];
  }, [selectedColor, product]);

  const images = product?.images || [];
  const primaryImage = getImageUrl(images[galleryIndex] || images[0] || null);

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
  const canBuy = !!selectedVariant || (!product?.colors && !product?.variants);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xl ${
          i < (rating || 0) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));

  const addToCart = () => {
    if (!canBuy) return toast.error("Select size first");
    if (quantity < 1) return toast.error("Invalid quantity");
    if (quantity > maxStock) return toast.error("Not enough stock");

    const item = selectedVariant || product;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const match = cart.find(
      (i) =>
        i.productId === product._id &&
        i.size === item.size &&
        i.color === (selectedColor?.color || i.color)
    );

    if (match) match.quantity += quantity;
    else
      cart.push({
        ...item,
        productId: product._id,
        color: selectedColor?.color || item.color,
        quantity,
      });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart");
  };

  if (loading)
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <div className="h-12 w-12 animate-spin border-t-4 border-green-600 rounded-full"></div>
      </div>
    );

  if (error || !product)
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster position="top-right" />

      {/* IMAGE + BUY SECTION */}
      <div className="grid lg:grid-cols-12 gap-10">
        {/* LEFT GALLERY */}
        <div className="lg:col-span-7">
          <div className="relative bg-white rounded-xl overflow-hidden">
            {isOnSale && (
              <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm shadow z-10 flex items-center gap-2">
                ↓ {discountPercent}% OFF
                <span
                  onClick={() => setShowOffers(!showOffers)}
                  className={`cursor-pointer text-lg ${
                    showOffers ? "-rotate-180" : ""
                  } transition`}
                >
                  ⌄
                </span>
              </div>
            )}

            <motion.img
              key={galleryIndex}
              src={primaryImage}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              className={`w-full h-[500px] object-cover transition duration-500 ${
                zoom ? "scale-105" : ""
              }`}
            />
          </div>
        </div>

        {/* RIGHT BUY PANEL */}
<div className="lg:col-span-5 sticky top-24 self-start">

  {/* TITLE */}
  <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>

  {/* RATINGS */}
  <div className="flex items-center gap-3 mt-3">
    <div className="flex">{renderStars(product.average_rating || 0)}</div>
    <span className="text-gray-600 text-sm">
      ({product.total_reviews || 0} reviews)
    </span>
  </div>

  {/* COLOR & SIZE INFO (SHOWN LIKE SCREENSHOT) */}
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

  {/* CHOOSE COLOUR */}
  {product.colors?.length > 0 && (
    <div className="mt-6">
      <span className="font-semibold text-sm">Choose Colour</span>
      <div className="flex flex-wrap gap-3 mt-2">
        {product.colors.map((c, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedColorIndex(index);
              setSelectedVariant(c.sizes?.[0] || null);
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

  {/* CHOOSE SIZE */}
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
                : "border-gray-300"
            }`}
          >
            {v.size}
          </button>
        ))}
      </div>
    </div>
  )}

  {/* QUANTITY */}
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
          setQuantity(Math.max(1, Math.min(maxStock, Number(e.target.value))))
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

  {/* PRICE + BUTTONS CARD (same layout as screenshot) */}
  <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
    <div className="flex items-baseline gap-3">
      <span className="text-2xl font-extrabold text-green-600">
        ₹{totalPrice.toLocaleString()}
      </span>
      {isOnSale && (
        <span className="line-through text-gray-400 text-md">
          ₹{totalOriginalPrice.toLocaleString()}
        </span>
      )}
    </div>

    <div className="mt-5 flex gap-4">
      <button
        onClick={addToCart}
        disabled={!canBuy}
        className={`flex-1 py-3 rounded-lg font-semibold ${
          canBuy
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-gray-500"
        }`}
      >
        Add to Cart
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
            : "border-gray-200 text-gray-400"
        }`}
      >
        Buy Now
      </button>
    </div>
  </div>
</div>
</div>
  
{/* OFFERS DROPDOWN
<div
  className="mt-4 bg-blue-600 text-white rounded-t-xl p-3 flex justify-between items-center cursor-pointer"
  onClick={() => setShowOffers(!showOffers)}
>
  <span className="font-semibold text-sm">Apply offers for maximum savings</span>
  <span className={`transform transition ${showOffers ? "rotate-180" : ""}`}>⌄</span>
</div>

{showOffers && (
  <div className="bg-blue-50 border border-blue-200 p-4 rounded-b-xl space-y-4">
    <div className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
      <div>
        <p className="font-semibold text-gray-900 text-sm">₹50 Off — BHIM UPI</p>
        <p className="text-xs text-gray-500">Best value for you</p>
      </div>
      <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
        Apply
      </button>
    </div>
  </div>
)} */}

{/* DELIVERY + RETURN + COD + QUALITY SECTION */}
<div className="mt-10 bg-white border rounded-2xl p-5 shadow-sm space-y-6">

  <div className="flex items-start gap-2">
    <span className="text-xl">🚚</span>
    <div>
      <p className="font-semibold">Fast Delivery Available</p>
      <p className="text-sm text-gray-600">Delivered securely to your location</p>
    </div>
  </div>

  <div className="flex items-start gap-2">
    <span className="text-xl">🛡️</span>
    <div>
      <p className="font-semibold">1-Year Warranty on Product</p>
      <p className="text-sm text-gray-600">Manufacturer warranty included</p>
    </div>
  </div>

  <div className="flex justify-between items-center text-sm pt-2">
    <div className="text-center flex flex-col items-center">
      <span className="text-2xl">🔄</span>
      <p>7 Days Return</p>
    </div>
    <div className="text-center flex flex-col items-center">
      <span className="text-2xl">💰</span>
      <p>Cash on Delivery</p>
    </div>
    <div className="text-center flex flex-col items-center">
      <span className="text-2xl">🧪</span>
      <p>Quality Checked</p>
    </div>
    <div className="text-center flex flex-col items-center">
      <span className="text-2xl">🔒</span>
      <p>Assured</p>
    </div>
  </div>
</div>

{/* COLLAPSIBLE DESCRIPTION */}
<div className="mt-10 border rounded-xl overflow-hidden">
  <div
    onClick={() => setShowDescription(!showDescription)}
    className="p-4 bg-gray-100 cursor-pointer flex justify-between items-center"
  >
    <h2 className="text-xl font-bold">Product Description</h2>
    <span className={`text-2xl transition ${showDescription ? "rotate-180" : ""}`}>
      ⌄
    </span>
  </div>

  {showDescription && (
    <div className="p-5 text-gray-700 leading-relaxed whitespace-pre-line bg-white">
      {product.description ||
        "No detailed description provided for this product."}
    </div>
  )}
</div>

{/* RETURN & REPLACEMENT POLICY */}
<div className="mt-10 bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-8 shadow-sm">
  <h2 className="text-2xl font-bold mb-4 text-gray-900">
    Return & Replacement Policy
  </h2>

  <ul className="space-y-3 text-gray-700 text-[15px]">
    <li>✔ 7-day Return / Replacement valid</li>
    <li>✔ Only for damaged / defective / incorrect delivery</li>
    <li>✔ Product must be unused & in original packaging</li>
    <li>✔ Replacement subject to stock availability</li>
    <li>✘ Change of mind / dislike / wrong size orders not eligible</li>
  </ul>

  <div className="mt-5 bg-green-100 border border-green-300 px-5 py-4 rounded-xl">
    <p className="text-gray-800 font-semibold">Need Help?</p>
    <p className="text-sm text-gray-700">
      Email us at <span className="font-bold text-green-700">support@curewrapplus.com</span>
    </p>
  </div>
</div>
{/* CUSTOMER REVIEWS */}
<div className="mt-16">
  <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
  {product.reviews?.length > 0 ? (
    <div className="space-y-4">
      {product.reviews.map((r, idx) => (
        <div key={idx} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
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

{/* REVIEW FORM */}
<div className="mt-12 border rounded-lg p-6 bg-white">
  {!isLoggedIn && (
    <p className="text-gray-600">
      ⭐ <span className="font-semibold text-red-500">Login required</span>{" "}
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
        onClick={async () => {
          if (!reviewComment.trim())
            return toast.error("Comment required");
          setSubmittingReview(true);
          try {
            const res = await fetch(
              `${backendUrl}/api/users/products/${id}/review`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
              }
            );
            const data = await res.json();
            if (!res.ok) toast.error(data.message || "Review failed");
            else {
              toast.success("Review submitted");
              setProduct((prev) => ({
                ...prev,
                reviews: [...(prev.reviews || []), data.review],
                total_reviews: (prev.total_reviews || 0) + 1,
              }));
              setReviewComment("");
              setReviewRating(5);
            }
          } finally {
            setSubmittingReview(false);
          }
        }}
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


