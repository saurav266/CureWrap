// src/pages/ProductViewPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

/**
 * Enhanced Product View Page — CureWrap theme (Green + Blue)
 * - Sticky purchase panel on desktop
 * - Image gallery + hover zoom
 * - Variant selector chips
 * - Quantity selector with stepper
 * - Improved price presentation and discount badge
 * - Reviews UI + improved review form
 * - Related products (simple grid)
 *
 * NOTE: Uses local uploaded fallback image at: /mnt/data/yoga-2587066_1280.jpg
 */

export default function ProductViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [related, setRelated] = useState([]);

  const backendUrl = "http://localhost:8000";
  const FALLBACK_IMAGE = "/mnt/data/yoga-2587066_1280.jpg"; // uploaded file path

  // helper: build image URL
  const getImageUrl = (img) => {
    if (!img?.url) return FALLBACK_IMAGE;
    return img.url.startsWith("http") ? img.url : `${backendUrl}/${img.url.replace(/^\/+/, "")}`;
  };

  // Fetch product + related small set
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
          setProduct(data.product);
          setSelectedVariant(data.product.variants?.[0] || null);
        }

        // fetch related products (lightweight)
        try {
          const relRes = await fetch(`${backendUrl}/api/users/products?limit=4`);
          const relData = await relRes.json();
          const arr = Array.isArray(relData.products) ? relData.products.filter(p => p._id !== id).slice(0,4) : [];
          setRelated(arr);
        } catch (e) {
          // fail silently for related
          setRelated([]);
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load product. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // derived data
  const primaryImageObj = useMemo(() => {
    // if selectedVariant defines its own image, prefer it
    const variantImg = selectedVariant?.images?.[0];
    if (variantImg) return variantImg;
    return product?.images?.[galleryIndex] || product?.images?.[0] || null;
  }, [product, selectedVariant, galleryIndex]);

  const primaryImage = getImageUrl(primaryImageObj);

  const displayPrice = selectedVariant?.sale_price ?? product?.sale_price ?? product?.price ?? 0;
  const originalPrice = selectedVariant?.price ?? product?.price ?? displayPrice;
  const maxStock = selectedVariant?.stock ?? product?.stock_quantity ?? 10;
  const isOnSale = displayPrice < originalPrice;
  const discountPercent = isOnSale ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

  const totalPrice = displayPrice * quantity;
  const totalOriginalPrice = originalPrice * quantity;

  // add to cart (improved: store variant id if present)
  const addToCart = () => {
    const item = selectedVariant || product;
    if (!item) return toast.error("No product selected");
    if (quantity < 1) return toast.error("Quantity must be at least 1");
    if (quantity > (selectedVariant?.stock || product?.stock_quantity || 9999)) return toast.error("Not enough stock");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(i => i._id === item._id);

    if (existing) {
      existing.quantity += quantity;
      cart = cart.map(i => (i._id === item._id ? existing : i));
    } else {
      cart.push({ ...item, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${quantity} item(s) added to cart!`);
  };

  // nicer submit review
  const submitReview = async () => {
    if (!reviewComment.trim()) return toast.error("Comment cannot be empty");
    setSubmittingReview(true);
    try {
      const res = await fetch(`${backendUrl}/api/users/products/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      const data = await res.json();

      if (!res.ok) toast.error(data.message || "Failed to submit review");
      else {
        toast.success("Review submitted!");
        setProduct(prev => ({
          ...prev,
          reviews: [...(prev.reviews || []), data.review],
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
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <svg key={i} aria-hidden className={`w-4 h-4 ${i < rating ? "fill-current text-yellow-400" : "text-gray-300"}`} viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.954L10 0l2.95 5.956 6.561.954-4.755 4.635 1.123 6.545z" />
      </svg>
    ));

  // small loading / error states
  if (loading) {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-600 font-semibold mb-4">{error || "Product not available"}</p>
        <button onClick={() => navigate("/")} className="px-6 py-3 rounded-lg bg-green-600 text-white">Return Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Gallery & thumbnails (cols 1-7 on lg) */}
        <div className="lg:col-span-7">
          <div className="relative bg-white rounded-xl overflow-hidden">
            {/* Discount badge */}
            {isOnSale && (
              <div className="absolute top-4 left-4 z-20 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                {discountPercent}% OFF
              </div>
            )}

            {/* Main image with zoom-on-hover */}
            <div
              className="w-full h-[520px] md:h-[560px] bg-gray-50 grid place-items-center overflow-hidden"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            >
              <motion.img
                src={primaryImage}
                alt={product.name}
                className={`object-cover transition-transform duration-300 ${zoom ? "scale-105" : "scale-100"} w-full h-full`}
                style={{ maxHeight: "100%", display: "block" }}
                draggable={false}
              />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {(product.images || []).map((img, idx) => {
              const src = getImageUrl(img);
              const active = galleryIndex === idx && !selectedVariant;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedVariant(null);
                    setGalleryIndex(idx);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border ${active ? "border-green-600 ring-2 ring-green-100" : "border-gray-200"}`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={src} alt={`thumb-${idx}`} className="w-full h-full object-cover" loading="lazy"/>
                </button>
              );
            })}

            {/* Variant thumbnails (if variant images exist) */}
            {product.variants?.map((v, i) => {
              const vimg = v.images?.[0];
              if (!vimg) return null;
              return (
                <button
                  key={`v-${i}`}
                  onClick={() => setSelectedVariant(v)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border ${selectedVariant?.sku === v.sku ? "border-green-600 ring-2 ring-green-100" : "border-gray-200"}`}
                  aria-label={`Variant ${v.sku}`}
                >
                  <img src={getImageUrl(vimg)} alt={`variant-${i}`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Sticky buy panel + details (cols 8-12) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            {/* Product title & rating */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex">{renderStars(Math.round(product.average_rating || 0))}</div>
              <div className="text-sm text-gray-600">({product.total_reviews || 0} reviews)</div>
            </div>

            {/* Short description */}
            <p className="text-gray-700 mt-4 leading-relaxed">{product.short_description || product.description}</p>

            {/* Variant selector */}
            {product.variants?.length > 0 && (
              <div className="mt-6">
                <div className="text-sm font-semibold mb-2">Choose Size</div>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => {
                    const size = v.attributes?.find(a => a.key === "size")?.value || v.sku;
                    const active = selectedVariant?.sku === v.sku;
                    return (
                      <button
                        key={v.sku}
                        onClick={() => {
                          setSelectedVariant(v);
                          setGalleryIndex(0);
                        }}
                        className={`px-4 py-2 rounded-lg border ${active ? "border-green-600 bg-green-50" : "border-gray-300 bg-white"} transition`}
                        aria-pressed={active}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-3">
              <div className="text-sm font-semibold">Quantity</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-md border border-gray-300 grid place-items-center"
                  aria-label="Decrease quantity"
                >−</button>
                <input
                  type="number"
                  min="1"
                  max={maxStock}
                  value={quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(maxStock, val)));
                  }}
                  className="w-20 text-center border rounded-md px-2 py-1"
                  aria-label="Quantity"
                />
                <button
                  onClick={() => setQuantity(q => Math.min(maxStock, q + 1))}
                  className="w-9 h-9 rounded-md border border-gray-300 grid place-items-center"
                  aria-label="Increase quantity"
                >+</button>
                <span className="text-sm text-gray-500 ml-2">Max {maxStock}</span>
              </div>
            </div>

            {/* Price card */}
            <div className="mt-6 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-baseline gap-3">
                <div className="text-2xl font-extrabold text-green-600">₹{totalPrice.toLocaleString()}</div>
                {isOnSale && (
                  <div className="text-sm line-through text-gray-400">₹{totalOriginalPrice.toLocaleString()}</div>
                )}
              </div>
              {isOnSale && (
                <div className="mt-2 text-sm text-gray-600">You save <span className="font-semibold text-green-700">₹{(totalOriginalPrice - totalPrice).toLocaleString()}</span> ({discountPercent}% off)</div>
              )}

              {/* CTA buttons */}
              <div className="mt-4 flex gap-3">
                <button onClick={addToCart} className="flex-1 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">
                  Add to Cart
                </button>
                <button onClick={() => { addToCart(); navigate("/checkout"); }} className="flex-1 py-3 rounded-lg border border-gray-300 font-semibold hover:bg-gray-50 transition">
                  Buy Now
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-4 flex gap-3 items-center text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-50 grid place-items-center text-green-600">✔</div>
                  <div>Premium Quality</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-50 grid place-items-center text-green-600">⏱</div>
                  <div>Fast Shipping</div>
                </div>
              </div>
            </div>

            {/* Additional info / shipping */}
            <div className="mt-6 text-sm text-gray-600">
              <div className="mb-2"><strong>Free returns</strong> within 30 days</div>
              <div><strong>Warranty:</strong> 12 months limited warranty</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & write review */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

          {product.reviews?.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((r, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">{r.user_id || "Anonymous"}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(r.rating)}</div>
                      <div className="text-sm text-gray-500">{new Date(r.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <p className="text-gray-700">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product.</p>
          )}
        </div>

        {/* Write review */}
        <div className="lg:col-span-1 border rounded-lg p-4 bg-white">
          <h3 className="font-semibold mb-3">Write a Review</h3>
          <label className="block text-sm mb-2">Rating</label>
          <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="w-full border rounded px-3 py-2 mb-3">
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r>1?'s':''}</option>)}
          </select>

          <label className="block text-sm mb-2">Comment</label>
          <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={4} className="w-full border rounded px-3 py-2 mb-3" />

          <button onClick={submitReview} disabled={submittingReview} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold">
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>

      {/* Related products */}
      {related?.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">You may also like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(r => (
              <div key={r._id} className="border rounded-lg p-3 hover:shadow-lg transition cursor-pointer" onClick={() => navigate(`/product/${r._id}`)}>
                <div className="w-full h-40 mb-3 overflow-hidden rounded">
                  <img src={getImageUrl(r.images?.[0])} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-sm font-semibold text-gray-900">{r.name}</div>
                <div className="text-sm text-green-700 font-bold">₹{(r.sale_price || r.price).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
