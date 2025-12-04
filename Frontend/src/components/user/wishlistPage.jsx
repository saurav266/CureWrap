// src/pages/WishlistPage.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const BACKEND_URL =
  import.meta?.env?.VITE_BACKEND_URL || "http://localhost:8000";

/**
 * Read and parse user from localStorage in a safe way.
 */
function readUserFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("[Wishlist] Failed to parse user from localStorage:", e);
    return null;
  }
}

/**
 * Try to normalize user identifiers from whatever shape the "user" object has.
 */
function getUserIdentifiers(user) {
  if (!user) return { userId: null, phone: null };

  const userId =
    user._id ||
    user.id ||
    user.userId ||
    user.user?._id ||
    user.user?.id ||
    null;

  const phone =
    user.phoneno ||
    user.phone ||
    user.mobile ||
    user.user?.phoneno ||
    user.user?.phone ||
    user.user?.mobile ||
    null;

  return { userId, phone };
}

const currency = (n = 0) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const getImageUrl = (img) => {
  if (!img) {
    return "https://via.placeholder.com/300x300?text=Product";
  }

  if (typeof img === "string") {
    return img.startsWith("http")
      ? img
      : `${BACKEND_URL}/${img.replace(/^\/+/, "")}`;
  }

  if (img.url) {
    return img.url.startsWith("http")
      ? img.url
      : `${BACKEND_URL}/${img.url.replace(/^\/+/, "")}`;
  }

  return "https://via.placeholder.com/300x300?text=Product";
};

export default function WishlistPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");

  // 1️⃣ Read user once on mount
  useEffect(() => {
    const u = readUserFromStorage();
    setUser(u);
    setLoading(false);
  }, []);

  const { userId, phone } = useMemo(() => getUserIdentifiers(user), [user]);

  const identifier = useMemo(() => phone || userId || null, [phone, userId]);

  // 2️⃣ Load wishlist when we have an identifier
  const loadWishlist = useCallback(async () => {
    if (!identifier) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BACKEND_URL}/api/wishlist/${identifier}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to load wishlist");
      }

      setWishlist(data.wishlist || []);
    } catch (err) {
      console.error("[Wishlist] Load error:", err);
      setError(err.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    if (!user) return; // user not logged in
    if (!identifier) {
      setError("Could not determine your account. Please login again.");
      return;
    }
    loadWishlist();
  }, [user, identifier, loadWishlist]);

  // 3️⃣ Remove item from wishlist
  const handleRemove = async (productId) => {
    if (!user) {
      toast.error("Please login to manage your wishlist.");
      return;
    }

    if (!identifier) {
      toast.error("User is not recognized. Please login again.");
      return;
    }

    try {
      setLoadingAction(true);

      const body = {
        userId,
        phoneno: phone,
        productId,
      };

      const res = await fetch(`${BACKEND_URL}/api/wishlist/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to remove");
      }

      setWishlist(data.wishlist || []);
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("[Wishlist] Remove error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoadingAction(false);
    }
  };

  // 4️⃣ Add wishlist item to cart
  const handleAddToCart = (product) => {
    if (!product?._id) return;

    const price = product.sale_price || product.price || 0;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const idx = cart.findIndex(
      (item) => item.productId === product._id && !item.size && !item.color
    );

    if (idx > -1) {
      cart[idx] = {
        ...cart[idx],
        quantity: (cart[idx].quantity || 1) + 1,
      };
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price,
        sale_price: product.sale_price,
        quantity: 1,
        image: product.images?.[0]?.url || product.image || "",
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart");
  };

  // ---------- RENDER STATES ----------

  // Still resolving user info
  if (loading && !user) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin border-4 border-gray-300 border-t-green-600 rounded-full" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <Toaster position="top-right" />
        <h1 className="text-2xl md:text-3xl font-bold mb-3">My Wishlist</h1>
        <p className="text-gray-600 mb-6">
          You need to log in to view and manage your wishlist.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">
            Saved items you might want to buy later.
          </p>
        </div>
        <button
          onClick={loadWishlist}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && wishlist.length === 0 && !error && (
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">
            Your wishlist is empty. Start adding products you love.
          </p>
          <Link
            to="/product"
            className="inline-block px-5 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
          >
            Browse Products
          </Link>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="min-h-[30vh] flex items-center justify-center">
          <div className="h-10 w-10 animate-spin border-4 border-gray-300 border-t-green-600 rounded-full" />
        </div>
      )}

      {/* List */}
      {!loading && wishlist.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {wishlist.length} item{wishlist.length > 1 ? "s" : ""} in your
            wishlist
          </p>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {wishlist.map((p) => {
              const img = getImageUrl(p.images?.[0] || p.image);
              const price = p.sale_price || p.price || 0;

              return (
                <article
                  key={p._id}
                  className="border rounded-lg shadow-sm bg-white flex flex-col overflow-hidden transition hover:shadow-md"
                >
                  <button
                    type="button"
                    className="w-full h-44 bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    <img
                      src={img}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <button
                      type="button"
                      className="text-left"
                      onClick={() => navigate(`/product/${p._id}`)}
                    >
                      <h2 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-900">
                        {p.name}
                      </h2>
                      <p className="mt-1 text-green-700 font-bold text-sm">
                        {currency(price)}
                      </p>
                      {p.sale_price && p.sale_price < p.price && (
                        <p className="text-xs text-gray-500 line-through">
                          {currency(p.price)}
                        </p>
                      )}
                    </button>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="flex-1 py-2 text-xs md:text-sm bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:opacity-60"
                        disabled={loadingAction}
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(p._id)}
                        className="px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                        disabled={loadingAction}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
