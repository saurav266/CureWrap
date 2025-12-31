// src/pages/ProductViewPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import ProductReview from "../components/user/view/ProductReviews"

const backendUrl = ""; // Adjust as needed
const FALLBACK_IMAGE = "/mnt/data/yoga-2587066_1280.jpg";

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



export default function ProductViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // User location pincode state
  const [pincode, setPincode] = useState(
      () => localStorage.getItem("user_pincode") || ""
    );
    const [pincodeStatus, setPincodeStatus] = useState(null); 
    // null | "checking" | "valid" | "invalid"
    const [city, setCity] = useState("");
    const [eta, setEta] = useState(null);
    const [courierName, setCourierName] = useState(null);


    useEffect(() => {
      if (pincode) localStorage.setItem("user_pincode", pincode);
    }, [pincode]);



  // ------------------------------ STATE ------------------------------
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const [galleryIndex, setGalleryIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  const [touchStartX, setTouchStartX] = useState(null); // swipe
  const [related, setRelated] = useState([]);

  // AUTH & PURCHASE STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  // WISHLIST
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  //review
  // const [sortBy, setSortBy] = useState("newest");
  // const [editingReview, setEditingReview] = useState(null);
  // const userStr = localStorage.getItem("user");
  // const currentUser = userStr ? JSON.parse(userStr) : null;

  // const startEditReview = (review) => {
  //   setEditingReview(review);
  //   setReviewRating(review.rating);
  //   setReviewComment(review.comment);
  // };


  // const sortedReviews = useMemo(() => {
  //   if (!product?.reviews) return [];
  //   const arr = [...product.reviews];
  //   if (sortBy === "highest") {
  //     return arr.sort((a, b) => b.rating - a.rating);
  //   }
  //   return arr.sort(
  //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //   );
  // }, [product, sortBy]);


  // ------------------------------ HELPERS ------------------------------
  const getCurrentUserAndId = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return { user: null, userId: null, phone: null };

    try {
      const parsed = JSON.parse(userStr);
      // support shapes: { _id, ... } OR { user: { _id, ... } }
      const coreUser = parsed.user || parsed;

      const userId =
        coreUser._id ||
        coreUser.id ||
        coreUser.userId ||
        coreUser.userid ||
        null;

      const phone =
        coreUser.phoneno ||
        coreUser.phone ||
        coreUser.mobile ||
        coreUser.phoneNumber ||
        null;

      return { user: coreUser, userId, phone };
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      return { user: null, userId: null, phone: null };
    }
  };

  const getImageUrl = (img) => {
    if (!img?.url) return FALLBACK_IMAGE;
    return img.url.startsWith("http")
      ? img.url
      : `${backendUrl}/${img.url.replace(/^\/+/, "")}`;
  };

  // ------------------------------ FETCH PRODUCT + RELATED + WISHLIST ------------------------------
  const fetchData = async () => {
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

    // RELATED
    try {
      const relRes = await fetch(`${backendUrl}/api/users/products`);
      const relData = await relRes.json();
      const all = Array.isArray(relData.products) ? relData.products : [];
      const others = all.filter((p) => p._id !== id);
      setRelated(others.slice(0, 4));
    } catch {
      setRelated([]);
    }

    // AUTH
    const { user: currentUser, userId, phone } = getCurrentUserAndId();
    setIsLoggedIn(!!currentUser);

    // WISHLIST
    if ((userId || phone) && data.product?._id) {
      try {
        const idToSend = userId || phone;
        const wlRes = await fetch(`${backendUrl}/api/wishlist/${idToSend}`);
        const wlData = await wlRes.json();

        if (wlRes.ok && wlData.success) {
          const inWishlist = wlData.wishlist.some((w) => {
            const pid =
              typeof w.product_id === "object"
                ? w.product_id._id
                : w.product_id;
            return pid === data.product._id;
          });
          setIsInWishlist(inWishlist);
        }
      } catch {}
    }

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
  useEffect(() => {
    fetchData();
  }, [id]);

  // ------------------------------ COLOR & VARIANT ------------------------------
  const selectedColor = useMemo(
    () => product?.colors?.[selectedColorIndex] || null,
    [product, selectedColorIndex]
  );

  const sizeOptions = useMemo(() => {
    if (selectedColor?.sizes?.length) return selectedColor.sizes;
    if (product?.variants?.length) return product.variants;
    return [];
  }, [selectedColor, product]);

  // ------------------------------ IMAGE SLIDER ------------------------------
  const images = product?.images || [];

  const primaryImageObj = images[galleryIndex] || images[0] || null;
  const primaryImage = getImageUrl(primaryImageObj);

  const handleNextImage = () => {
    if (!images.length) return;
    setGalleryIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    if (!images.length) return;
    setGalleryIndex((prev) => (prev - 1 < 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    setGalleryIndex(0);
  }, [id]);

  // autoplay – stops when zoom=true (hover) and resumes on leave
  useEffect(() => {
    if (!images.length || images.length === 1 || zoom) return;
    const interval = setInterval(
      () => setGalleryIndex((prev) => (prev + 1) % images.length),
      3000
    );
    return () => clearInterval(interval);
  }, [images.length, zoom]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    const threshold = 50;
    if (diff > threshold) handlePrevImage();
    else if (diff < -threshold) handleNextImage();
    setTouchStartX(null);
  };

  // ------------------------------ PRICE & STOCK ------------------------------
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
  const savings = Math.max(totalOriginalPrice - totalPrice, 0);

  const maxStock = selectedVariant?.stock ?? product?.stock_quantity ?? 10;

  const hasColourSizeOptions =
    (product?.colors && product.colors.length > 0) ||
    (product?.variants && product.variants.length > 0);

  const canBuy = !hasColourSizeOptions || !!selectedVariant;

  // ------------------------------ EXPECTED DELIVERY ------------------------------
  const getExpectedDeliveryText = () => {
    const now = new Date();

    const min = new Date(now);
    min.setDate(min.getDate() + 4);

    const max = new Date(now);
    max.setDate(max.getDate() + 7);

    const format = (d) =>
      d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });

    return `Expected delivery: ${format(min)} – ${format(max)}`;
  };

  // ------------------------------ WISHLIST TOGGLE ------------------------------
  const handleToggleWishlist = async () => {
    const { user, userId, phone } = getCurrentUserAndId();

    if (!user || (!userId && !phone)) {
      toast.error("Please login to use wishlist.");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    if (!product?._id) return;

    try {
      setWishlistLoading(true);

      const res = await fetch(`${backendUrl}/api/wishlist/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || undefined,
          phoneno: phone || undefined,
          productId: product._id,
        }),
      });

      const data = await res.json();
      console.log("toggle wishlist res:", res.status, data);

      if (!res.ok || !data.success) {
        toast.error(data.message || "Wishlist action failed");
        return;
      }

      if (data.action === "added") {
        setIsInWishlist(true);
        toast.success("Added to wishlist ❤️");
      } else if (data.action === "removed") {
        setIsInWishlist(false);
        toast("Removed from wishlist", { icon: "🗑️" });
      }
    } catch (err) {
      console.error("toggleWishlist error:", err);
      toast.error("Could not update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  // ------------------------------ ADD TO CART ------------------------------
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

  const sizes = sizeOptions.map((v) => v.size); // 👈 all available sizes

  const existing = cart.find(
    (i) =>
      i.productId === product._id &&
      i.selectedSize === item.size &&
      i.color === (selectedColor?.color || i.color)
  );

  if (existing) {
    existing.quantity += quantity;
    cart = cart.map((i) =>
      i.productId === product._id &&
      i.selectedSize === item.size &&
      i.color === (selectedColor?.color || i.color)
        ? existing
        : i
    );
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price:
        item.sale_price ||
        item.price ||
        product.sale_price ||
        product.price,
      sale_price: item.sale_price,
      selectedSize: item.size,     // ✅ SAVE selected size
      sizes,                       // ✅ SAVE all size options
      color: selectedColor?.color || item.color,
      quantity,
      stock: item.stock,
      images:
        selectedColor?.images?.length
          ? selectedColor.images
          : product.images || [],
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
  toast.success("Added to cart!");
};


  const buyNow = () => {
  if (hasColourSizeOptions && !selectedVariant) {
    toast.error("Please select a size first.");
    return;
  }

  const item = selectedVariant || product;
  if (!item) return toast.error("No product selected.");

  if (quantity < 1) return toast.error("Quantity must be at least 1");
  if (quantity > maxStock) return toast.error("Not enough stock");

  const sizes = sizeOptions.map((v) => v.size);

  const cartItem = {
    productId: product._id,
    name: product.name,
    price:
      item.sale_price ||
      item.price ||
      product.sale_price ||
      product.price,
    sale_price: item.sale_price,
    selectedSize: item.size,   // ✅
    sizes,                     // ✅
    color: selectedColor?.color || item.color,
    quantity,
    stock: item.stock,
    images:
      selectedColor?.images?.length
        ? selectedColor.images
        : product.images || [],
  };

  localStorage.setItem("cart", JSON.stringify([cartItem]));
  window.dispatchEvent(new Event("cartUpdated"));
  navigate("/checkout");
};



  // ------------------------------ SUBMIT REVIEW ------------------------------
//   const submitReview = async () => {
//   const token = localStorage.getItem("token");
//   const url = editingReview
//     ? `${backendUrl}/api/users/products/${id}/review/${editingReview._id}`
//     : `${backendUrl}/api/users/products/${id}/review`;

//   const method = editingReview ? "PUT" : "POST";

//   const res = await fetch(url, {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       rating: reviewRating,
//       comment: reviewComment,
//     }),
//   });

//   const data = await res.json();
//   if (!res.ok) return toast.error(data.message || "Failed");

//   toast.success(editingReview ? "Review updated" : "Review added");

//   await fetchProduct(); // refetch product
//   setEditingReview(null);
//   setReviewComment("");
//   setReviewRating(5);
// };
 
//--------------delete review-----------------
// const handleDeleteReview = async (reviewId) => {
//   if (!window.confirm("Delete your review?")) return;

//   const token = localStorage.getItem("token");

//   const res = await fetch(
//     `${backendUrl}/api/users/products/${id}/review/${reviewId}`,
//     {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   const data = await res.json();
//   if (!res.ok) return toast.error(data.message || "Delete failed");

//   toast.success("Review deleted");
//   await fetchProduct();
// };



  // ------------------------------ STARS ------------------------------
  // const renderStars = (rating) =>
  //   Array.from({ length: 5 }, (_, i) => (
  //     <span
  //       key={i}
  //       className={`text-xl ${
  //         i < (rating || 0) ? "text-yellow-400" : "text-gray-300"
  //       }`}
  //     >
  //       ★
  //     </span>
  //   ));

  //   // ------------------------------ USER LOGIN STATUS ------------------------------
  //   const myReview = useMemo(() => {
  //     if (!product?.reviews || !currentUser) return null;
  //     return product.reviews.find(
  //       (r) => r.user_id === currentUser._id
  //     );
  //   }, [product, currentUser]);


  // ------------------------------ LOADING / ERROR ------------------------------
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

  const canProceed = canBuy && (isLoggedIn || pincodeStatus === "valid");
  //check pincode
  const checkPincode = async () => {
  if (!/^\d{6}$/.test(pincode)) {
    toast.error("Enter a valid 6-digit pincode");
    return;
  }

  try {
    setPincodeStatus("checking");

    const res = await fetch(`${backendUrl}/api/shipping/check-pincode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pincode }),
    });

    const data = await res.json();

    if (res.ok && data.success && data.serviceable) {
    setPincodeStatus("valid");

    if (data.etaDays) {
      const d = new Date();
      d.setDate(d.getDate() + Number(data.etaDays));
      setEta(
        d.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      );
    } else {
      setEta(null);
    }

    setCourierName("Shiprocket");

    toast.success("Delivery available to your location");
  } else {
    setPincodeStatus("invalid");
    setEta(null);
    setCourierName(null);
    toast.error("Delivery not available at this pincode");
  }

  } catch (err) {
    console.error(err);
    toast.error("Could not verify pincode");
    setPincodeStatus("invalid");
  }
};

const detectLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();

        const pin = data?.address?.postcode;
        const cityName = data?.address?.city || data?.address?.town || "";

        if (pin) {
          setPincode(pin);
          setCity(cityName);

          // ✅ ADD THESE LINES HERE
          setPincodeStatus("valid");
          setCourierName("Shiprocket");

          // simple fallback ETA (about 5 days)
          const d = new Date();
          d.setDate(d.getDate() + 5);
          setEta(
            d.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })
          );

          toast.success(`Location detected: ${pin}`);
        } else {
          toast.error("Could not detect pincode");
        }
      } catch {
        toast.error("Failed to fetch location details");
      }
    },
    () => toast.error("Location permission denied")
  );
};

  // ------------------------------ PAGE UI ------------------------------
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 xl:px-20 py-6">
      <Toaster position="top-right" />

      {/* GALLERY + BUY AREA */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 items-start">
        {/* LEFT: Gallery */}
        <div className="lg:col-span-8 w-full">
          <div className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            {isOnSale && (
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm shadow z-10">
                {discountPercent}% OFF
              </div>
            )}

            {/* Wishlist on image top-right */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              disabled={wishlistLoading}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 sm:p-2.5 rounded-full bg-white/90 border border-gray-200 shadow-md hover:bg-pink-50 hover:border-pink-300 transition disabled:opacity-60"
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isInWishlist ? (
                <AiFillHeart className="text-pink-600 text-[20px] sm:text-[22px]" />
              ) : (
                <AiOutlineHeart className="text-pink-600 text-[20px] sm:text-[22px]" />
              )}
            </button>

            {/* MAIN IMAGE BOX */}
            <div
              className="relative w-full bg-gray-100 overflow-hidden flex items-center justify-center
                         h-[320px] sm:h-[360px] md:h-[420px] lg:h-[480px]"
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
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 sm:w-10 sm:h-10 grid place-items-center shadow text-lg"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 sm:w-10 sm:h-10 grid place-items-center shadow text-lg"
                  >
                    ›
                  </button>
                </>
              )}

              <motion.img
                key={galleryIndex}
                src={primaryImage}
                alt={product.name}
                loading="lazy"
                className={`max-h-full h-full w-auto max-w-full object-contain transition-transform duration-500 ${
                  zoom ? "scale-[1.03]" : "scale-100"
                }`}
              />
            </div>
          </div>

          {/* DOT INDICATORS */}
          {images.length > 1 && (
            <div className="mt-3 sm:mt-4 flex justify-center gap-2">
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
        <div className="lg:col-span-4 xl:col-span-4 mt-6 lg:mt-0 xl:sticky xl:top-24 self-start">
          {/* RIGHT HEADER - TITLE + RATING */}
          <div className="w-full flex flex-col gap-2">
            <h1
              className="text-[1.2rem] sm:text-[1.7rem] font-semibold leading-snug text-gray-900 break-words line-clamp-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "horizontal",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex">{renderStars(product.average_rating || 0)}</div>
              <span className="text-gray-600 text-xs sm:text-sm">
                ({product.total_reviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* Selected colour & size summary pills */}
          <div className="mt-3 flex flex-wrap gap-3 text-[13px] font-medium text-gray-700">
            {selectedColor && (
              <span className="px-2.5 py-1 bg-gray-100 rounded-full">
                Color: <b>{selectedColor.color}</b>
              </span>
            )}
            {selectedVariant?.size && (
              <span className="px-2.5 py-1 bg-gray-100 rounded-full">
                Size: <b>{selectedVariant.size}</b>
              </span>
            )}
          </div>

          {/* COLOR SELECTOR */}
          {product.colors?.length > 0 && (
            <div className="mt-5">
              <span className="font-semibold text-sm text-gray-800">
                Choose Colour
              </span>

              <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
                {product.colors.map((c, index) => {
                  const isActive = selectedColorIndex === index;

                  return (
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
                      className={`group flex items-center gap-2 px-3 py-2 rounded-full border text-xs sm:text-sm font-medium
                        transition-all duration-200
                        ${
                          isActive
                            ? "border-green-600 bg-green-50 shadow-sm scale-[1.03]"
                            : "border-gray-300 bg-white hover:border-green-400 hover:bg-gray-50 hover:shadow-sm"
                        }`}
                    >
                      <span
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border shadow-inner"
                        style={{
                          backgroundColor:
                            c.hex || c.color?.toLowerCase() || "#f3f4f6",
                        }}
                      />
                      <span
                        className={
                          isActive ? "text-green-700" : "text-gray-800"
                        }
                      >
                        {c.color}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR */}
          {sizeOptions.length > 0 && (
            <div className="mt-5">
              <span className="font-semibold text-sm text-gray-800">
                Choose Size
              </span>

              <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
                {sizeOptions.map((v, index) => {
                  const isActive = selectedVariant?.size === v.size;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(v)}
                      className={`min-w-[44px] sm:min-w-[48px] px-3 sm:px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold tracking-wide
                          transition-all duration-200
                          ${
                            isActive
                              ? "border-green-600 bg-green-600 text-white shadow-sm scale-[1.03]"
                              : "border-gray-300 bg-white text-gray-800 hover:border-green-400 hover:bg-gray-50 hover:shadow-sm"
                          }`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="mt-7">
            <span className="font-semibold text-sm text-gray-800">
              Quantity
            </span>

            <div className="mt-2 inline-flex items-center rounded-full border border-gray-300 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-bold
                          hover:bg-gray-100 active:scale-95 transition"
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
                className="w-12 sm:w-14 text-center text-sm font-semibold border-x border-gray-200 focus:outline-none"
              />

              <button
                onClick={() =>
                  setQuantity((q) => Math.min(maxStock, q + 1))
                }
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-bold
                          hover:bg-gray-100 active:scale-95 transition"
              >
                +
              </button>
            </div>

            <div className="mt-1 text-xs">
              {maxStock > 0 ? (
                <span className="text-green-600 font-medium">
                  In stock: {maxStock}
                </span>
              ) : (
                <span className="text-red-500 font-medium">
                  Out of stock
                </span>
              )}
            </div>
          </div>

          {/* Price Card */}
          <div className="mt-5 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-baseline gap-3">
              <span className="text-xl sm:text-2xl font-extrabold text-green-600">
                ₹{totalPrice.toLocaleString()}
              </span>
              {isOnSale && (
                <span className="line-through text-gray-400 text-sm sm:text-base">
                  ₹{totalOriginalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {isOnSale && (
              <div className="mt-1 text-xs sm:text-sm">
                <span className="text-red-600 font-semibold">
                  You save ₹{savings.toLocaleString()} ({discountPercent}% OFF)
                </span>
              </div>
            )}

            {/* Expected delivery */}
            {pincodeStatus === "valid" && (
            <p className="mt-1 text-xs text-green-600">
              ✔ Delivery available {city && `in ${city}`}
              {eta && (
                <span className="block text-gray-600 mt-0.5">
                  🚚 Expected delivery by <b>{eta}</b> 
                </span>
              )}
            </p>
            )}
            {/* Action buttons */}
  <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
    <button
      onClick={addToCart}
      disabled={!canProceed}
      className={`flex-1 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base ${
        canProceed
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      {!canBuy
        ? "Select size first"
        : !isLoggedIn && pincodeStatus !== "valid"
        ? "Enter pincode"
        : "Add to Cart"}
    </button>

    <button
      onClick={buyNow}
      disabled={!canProceed}
      className={`flex-1 py-2.5 sm:py-3 border rounded-lg font-semibold text-sm sm:text-base ${
        canProceed
          ? "border-gray-300 hover:bg-gray-50"
          : "border-gray-200 text-gray-400 cursor-not-allowed"
      }`}
    >
      Buy Now
    </button>
  </div>
            {pincodeStatus !== "valid" && (
          <div className="mt-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Check delivery
              </label>

    <div className="flex gap-2">
      <input
        type="text"
        value={pincode}
        onChange={(e) => {
          setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
          setPincodeStatus(null);
        }}
        placeholder="Enter pincode"
        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-600"
      />

      <button
        onClick={checkPincode}
        disabled={pincodeStatus === "checking"}
        className="px-4 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
      >
        {pincodeStatus === "checking" ? "..." : "Check"}
      </button>

      <button
        onClick={detectLocation}
        title="Detect my location"
        className="px-3 rounded-lg border text-sm hover:bg-gray-50"
      >
        📍
      </button>
    </div>


  </div>
)}


          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-12 sm:mt-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          Product Description
        </h2>

        {(() => {
          const descriptionText =
            product.description ||
            "No detailed description provided for this product.";

          const isLong = descriptionText.length > 220;

          return (
            <>
              <motion.div
                initial={{ height: 120 }}
                animate={{ height: showFullDescription ? "auto" : 120 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="relative overflow-hidden"
              >
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {descriptionText}
                </p>

                {!showFullDescription && isLong && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                )}
              </motion.div>

              {isLong && (
                <button
                  type="button"
                  onClick={() =>
                    setShowFullDescription((prev) => !prev)
                  }
                  className="mt-2 text-sm font-semibold text-green-600 hover:text-green-700 hover:underline"
                >
                  {showFullDescription ? "See Less ▲" : "See More ▼"}
                </button>
              )}
            </>
          );
        })()}
      </div>

      {/* RETURN POLICY */}
      <div className="mt-8 sm:mt-10 border rounded-xl bg-white p-4 sm:p-6 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-3">
          Return & Refund Policy
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          We want you to be fully satisfied with your purchase.
        </p>

        <ul className="mt-3 list-disc list-inside text-gray-700 text-sm space-y-1">
          <li>
            <span className="font-semibold">Easy returns within 7 days</span>{" "}
            of delivery for incorrect and damaged products.
          </li>
          <li>
            <span className="font-semibold">one time free size</span>{" "}
             exchange within 7 days of delivery.
          </li>
          <li>
            Product must be unused, unwashed, and in its{" "}
            <span className="font-semibold">original packaging</span> with all
            tags intact.
          </li>
          <li>
            Refund will be processed to your original payment method within{" "}
            <span className="font-semibold">5–7 business days</span> after
            quality check.
          </li>
          <li>
            For any support, contact us at{" "}
            <span className="font-semibold">support@curewrapplus.com</span>.
          </li>
        </ul>

        <p className="mt-3 text-xs text-gray-500">
          *Return policy may vary for offers or special sale items.
        </p>
      </div>

      {/* ================= REVIEWS SECTION ================= */}
      <div className="mt-12 sm:mt-16">

        <ProductReview
        product={product}
        productId={id}
        backendUrl={backendUrl}
        hasPurchased={hasPurchased}
        fetchProduct={fetchData}/>
      </div>


      {/* RELATED PRODUCTS */}
      {related?.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/product/${r._id}`)}
                className="cursor-pointer border rounded-lg shadow-sm hover:shadow-md transition p-3 bg-white"
              >
                <div className="w-full h-32 sm:h-40 overflow-hidden rounded-lg mb-2 sm:mb-3">
                  <img
                    src={getImageUrl(r.images?.[0])}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    alt={r.name}
                  />
                </div>
                <p className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2">
                  {r.name}
                </p>
                <p className="text-green-700 font-bold text-xs sm:text-sm mt-1">
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