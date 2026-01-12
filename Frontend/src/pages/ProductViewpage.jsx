// src/pages/ProductViewPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import ProductGallery from "../components/user/view/ProductGallery";
import ProductInfoPanel from "../components/user/view/ProductInfoPanel";
import ProductDescription from "../components/user/view/ProductDescription";
import ProductReviews from "../components/user/view/ProductReviews";
import RelatedProducts from "../components/user/view/RelatedProducts";

const backendUrl = ""; // Adjust as needed

export default function ProductViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // review state
  const [sortBy, setSortBy] = useState("newest");
  const [editingReview, setEditingReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ fetch product
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/users/products/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setProduct(data.product);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const sortedReviews = useMemo(() => {
    if (!product?.reviews) return [];
    const arr = [...product.reviews];
    if (sortBy === "highest") return arr.sort((a, b) => b.rating - a.rating);
    return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [product, sortBy]);

  if (loading) return <div className="p-10 text-center">Loading…</div>;
  if (error || !product)
    return <div className="p-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <Toaster />

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ProductGallery product={product} />
        </div>

        <div className="lg:col-span-4">
          <ProductInfoPanel product={product} />
        </div>
      </div>

      <ProductDescription description={product.description} />

      <ProductReviews
        product={product}
        currentUser={currentUser}
        sortedReviews={sortedReviews}
        sortBy={sortBy}
        setSortBy={setSortBy}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        editingReview={editingReview}
        setEditingReview={setEditingReview}
        submittingReview={submittingReview}
        setSubmittingReview={setSubmittingReview}
        fetchProduct={fetchProduct}
      />

      <RelatedProducts related={related} onClick={id => navigate(`/product/${id}`)} />
    </div>
  );
}
