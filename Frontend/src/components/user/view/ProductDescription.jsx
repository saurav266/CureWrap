// src/components/product/ProductDescription.jsx
export default function ProductDescription({ description }) {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-2">Product Description</h2>
      <p className="text-gray-700 whitespace-pre-line">
        {description || "No description provided."}
      </p>
    </div>
  );
}
