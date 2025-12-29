import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

// ⭐ Star input
const StarRatingInput = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className={`text-2xl transition ${
          star <= value
            ? "text-yellow-400"
            : "text-gray-300 hover:text-yellow-300"
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

// ⭐ Render stars
const renderStars = (rating = 0) =>
  Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={`text-xl ${
        i < rating ? "text-yellow-400" : "text-gray-300"
      }`}
    >
      ★
    </span>
  ));

// ⏱️ Time ago helper
const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  const mins = Math.floor(diff / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
};

export default function ReviewsSection({
  product,
  productId,
  backendUrl,
  fetchProduct,
  hasPurchased,   // ✅ NEW
}) {
  const [sortBy, setSortBy] = useState("newest");
  const [editingReview, setEditingReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");

  // 🧠 my review
  const myReview = useMemo(() => {
    if (!product?.reviews || !currentUser) return null;
    return product.reviews.find(
      (r) => r.user_id === currentUser._id
    );
  }, [product, currentUser]);

  const sortedReviews = useMemo(() => {
    if (!product?.reviews) return [];
    const arr = [...product.reviews];
    if (sortBy === "highest") return arr.sort((a, b) => b.rating - a.rating);
    if (sortBy === "lowest") return arr.sort((a, b) => a.rating - b.rating);
    return arr.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [product, sortBy]);

  const startEditReview = (review) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewComment(review.comment);
  };

  // ➕➖ submit / update
  const submitReview = async () => {
    if (!hasPurchased) {
      toast.error("You can review only after purchasing this product.");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    if (!token) {
      toast.error("Login required.");
      return;
    }

    const url = editingReview
      ? `${backendUrl}/api/users/products/${productId}/review/${editingReview._id}`
      : `${backendUrl}/api/users/products/${productId}/review`;

    const method = editingReview ? "PUT" : "POST";

    setSubmittingReview(true);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      toast.success(editingReview ? "Review updated" : "Review added");
      await fetchProduct();
      setEditingReview(null);
      setReviewComment("");
      setReviewRating(5);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  // 🗑️ delete
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete your review?")) return;
    if (!token) return toast.error("Login required.");

    try {
      const res = await fetch(
        `${backendUrl}/api/users/products/${productId}/review/${reviewId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      toast.success("Review deleted");
      await fetchProduct();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mt-12 sm:mt-16">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Customer Reviews
        </h2>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm w-full sm:w-auto"
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* ===== REVIEWS LIST ===== */}
      {sortedReviews.length > 0 ? (
        <div className="space-y-4">
          {sortedReviews.map((r, idx) => {
            const isMine =
              currentUser && r.user_id === currentUser._id;

            return (
              <div
                key={idx}
                className={`border rounded-lg p-4 shadow-sm ${
                  isMine
                    ? "bg-green-50 border-green-300"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm sm:text-base">
                      {r.name || "User"}
                    </span>
                    {isMine && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                        Your Review
                      </span>
                    )}
                  </div>

                  <span className="text-gray-500 text-xs sm:text-sm">
                    {r.createdAt ? timeAgo(r.createdAt) : ""}
                  </span>
                </div>

                <div className="flex mb-1">
                  {renderStars(r.rating)}
                </div>

                <p className="text-gray-700 text-sm sm:text-base">
                  {r.comment}
                </p>

                {isMine && (
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => startEditReview(r)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(r._id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm sm:text-base">
          No reviews yet.
        </p>
      )}

      {/* ===== WRITE / EDIT ===== */}
      <div className="mt-10 sm:mt-12 border rounded-lg p-4 sm:p-6 bg-white">
        {!currentUser && (
          <p className="text-gray-600 text-sm sm:text-base">
            ⭐ <span className="font-semibold text-red-500">Login required</span>{" "}
            to write a review.
          </p>
        )}

        {currentUser && !hasPurchased && (
          <p className="text-gray-600 text-sm sm:text-base">
            ⭐ You can review this product only after{" "}
            <span className="font-semibold text-blue-600">purchasing</span> it.
          </p>
        )}

        {currentUser && hasPurchased && myReview && !editingReview && (
          <p className="text-sm text-green-700 font-medium">
            ✅ You already reviewed this product.
          </p>
        )}

        {currentUser && hasPurchased && (!myReview || editingReview) && (
          <>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              {editingReview ? "Edit Your Review" : "Write a Review"}
            </h3>

            <label className="block text-sm mb-2 font-medium">
              Rating
            </label>
            <StarRatingInput
              value={reviewRating}
              onChange={setReviewRating}
            />

            <label className="block text-sm mt-4 mb-2 font-medium">
              Comment
            </label>
            <textarea
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4 text-sm sm:text-base"
            />

            <div className="flex gap-3">
              <button
                onClick={submitReview}
                disabled={submittingReview}
                className="flex-1 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 text-sm sm:text-base"
              >
                {submittingReview
                  ? "Submitting..."
                  : editingReview
                  ? "Update Review"
                  : "Submit Review"}
              </button>

              {editingReview && (
                <button
                  onClick={() => {
                    setEditingReview(null);
                    setReviewComment("");
                    setReviewRating(5);
                  }}
                  className="flex-1 py-2.5 sm:py-3 border rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
