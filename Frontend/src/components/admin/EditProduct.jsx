// src/pages/EditProduct.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const backendUrl = "";

const defaultImage = { url: "", alt_text: "", is_primary: true };
const defaultColor = {
  color: "",
  images: [{ ...defaultImage }],
  sizes: [{ size: "", price: "", sale_price: "", stock: "", quantity: 1 }],
};

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    sale_price: "",
    category: "",
    images: [{ ...defaultImage }],
    colors: [{ ...defaultColor }],
  });

  // ---------------- Fetch existing product ----------------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // adjust URL if needed
        const res = await axios.get(`${backendUrl}/api/users/products/${id}`);
        const p = res.data.product;

        if (!p) {
          toast.error("Product not found");
          navigate("/admin/products");
          return;
        }

        const images =
          Array.isArray(p.images) && p.images.length > 0
            ? p.images.map((img, idx) => ({
                url: img.url || "",
                alt_text: img.alt_text || "",
                is_primary:
                  typeof img.is_primary === "boolean"
                    ? img.is_primary
                    : idx === 0,
              }))
            : [{ ...defaultImage }];

        const colors =
          Array.isArray(p.colors) && p.colors.length > 0
            ? p.colors.map((c) => ({
                color: c.color || "",
                images:
                  Array.isArray(c.images) && c.images.length > 0
                    ? c.images.map((img, idx) => ({
                        url: img.url || "",
                        alt_text: img.alt_text || "",
                        is_primary:
                          typeof img.is_primary === "boolean"
                            ? img.is_primary
                            : idx === 0,
                      }))
                    : [{ ...defaultImage }],
                sizes:
                  Array.isArray(c.sizes) && c.sizes.length > 0
                    ? c.sizes.map((s) => ({
                        size: s.size || "",
                        price: s.price ?? "",
                        sale_price: s.sale_price ?? "",
                        stock: s.stock ?? "",
                        quantity: s.quantity ?? 1,
                      }))
                    : [{ size: "", price: "", sale_price: "", stock: "", quantity: 1 }],
              }))
            : [{ ...defaultColor }];

        setProduct({
          name: p.name || "",
          description: p.description || "",
          price: p.price ?? "",
          sale_price: p.sale_price ?? "",
          category: p.category || "",
          images,
          colors,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // ---------------- Basic handlers ----------------
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ---------------- Main Product Images ----------------
  const handleImageChange = (index, key, value) => {
    const updated = [...product.images];
    updated[index][key] = value;
    setProduct({ ...product, images: updated });
  };

  const addImageField = () => {
    setProduct({
      ...product,
      images: [
        ...product.images,
        { url: "", alt_text: "", is_primary: false },
      ],
    });
  };

  const setPrimaryImage = (index) => {
    const updated = product.images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    setProduct({ ...product, images: updated });
  };

  const removeImage = (index) => {
    const updated = product.images.filter((_, i) => i !== index);
    // ensure at least one image row exists
    setProduct({
      ...product,
      images: updated.length ? updated : [{ ...defaultImage }],
    });
  };

  // ---------------- Colors ----------------
  const addColor = () => {
    setProduct({
      ...product,
      colors: [
        ...product.colors,
        {
          color: "",
          images: [{ url: "", alt_text: "", is_primary: true }],
          sizes: [
            { size: "", price: "", sale_price: "", stock: "", quantity: 1 },
          ],
        },
      ],
    });
  };

  const removeColor = (index) => {
    const updated = product.colors.filter((_, i) => i !== index);
    setProduct({
      ...product,
      colors: updated.length ? updated : [{ ...defaultColor }],
    });
  };

  const updateColorField = (index, key, value) => {
    const updated = [...product.colors];
    updated[index][key] = value;
    setProduct({ ...product, colors: updated });
  };

  // ---------------- Color Images ----------------
  const addColorImage = (colorIndex) => {
    const updated = [...product.colors];
    updated[colorIndex].images.push({
      url: "",
      alt_text: "",
      is_primary: false,
    });
    setProduct({ ...product, colors: updated });
  };

  const updateColorImage = (colorIndex, imgIndex, key, value) => {
    const updated = [...product.colors];
    updated[colorIndex].images[imgIndex][key] = value;
    setProduct({ ...product, colors: updated });
  };

  const setPrimaryColorImage = (colorIndex, imgIndex) => {
    const updated = [...product.colors];
    updated[colorIndex].images = updated[colorIndex].images.map((img, i) => ({
      ...img,
      is_primary: i === imgIndex,
    }));
    setProduct({ ...product, colors: updated });
  };

  const removeColorImage = (colorIndex, imgIndex) => {
    const updated = [...product.colors];
    const imgs = updated[colorIndex].images.filter((_, i) => i !== imgIndex);
    updated[colorIndex].images = imgs.length
      ? imgs
      : [{ url: "", alt_text: "", is_primary: true }];
    setProduct({ ...product, colors: updated });
  };

  // ---------------- Sizes ----------------
  const addSize = (colorIndex) => {
    const updated = [...product.colors];
    updated[colorIndex].sizes.push({
      size: "",
      price: "",
      sale_price: "",
      stock: "",
      quantity: 1,
    });
    setProduct({ ...product, colors: updated });
  };

  const updateSize = (colorIndex, sizeIndex, key, value) => {
    const updated = [...product.colors];
    if (["price", "sale_price", "stock", "quantity"].includes(key)) {
      updated[colorIndex].sizes[sizeIndex][key] = Number(value || 0);
    } else {
      updated[colorIndex].sizes[sizeIndex][key] = value;
    }
    setProduct({ ...product, colors: updated });
  };

  const removeSize = (colorIndex, sizeIndex) => {
    const updated = [...product.colors];
    const sizes = updated[colorIndex].sizes.filter((_, i) => i !== sizeIndex);
    updated[colorIndex].sizes = sizes.length
      ? sizes
      : [{ size: "", price: "", sale_price: "", stock: "", quantity: 1 }];
    setProduct({ ...product, colors: updated });
  };

  // ---------------- Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...product,
        price: Number(product.price),
        sale_price: Number(product.sale_price || 0),
      };

      // adjust URL if your update route is different
      await axios.put(`${backendUrl}/api/users/products/${id}`, payload);

      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error updating product");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="sale_price"
          placeholder="Sale Price"
          value={product.sale_price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Product Images */}
        <div>
          <h3 className="font-semibold mb-2">Product Images</h3>
          {product.images.map((img, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                placeholder="Image URL"
                value={img.url}
                onChange={(e) => handleImageChange(i, "url", e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Alt Text"
                value={img.alt_text}
                onChange={(e) =>
                  handleImageChange(i, "alt_text", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => setPrimaryImage(i)}
                className={`px-2 py-1 rounded text-white ${
                  img.is_primary ? "bg-green-600" : "bg-gray-400"
                }`}
              >
                {img.is_primary ? "Primary" : "Set Primary"}
              </button>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="px-2 py-1 rounded bg-red-600 text-white"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            + Add Image
          </button>
        </div>

        {/* Colors & Sizes */}
        <div>
          <h3 className="font-semibold mb-2">Colors & Sizes</h3>
          {product.colors.map((color, ci) => (
            <div key={ci} className="border p-3 mb-3 rounded">
              <input
                type="text"
                placeholder="Color"
                value={color.color}
                onChange={(e) =>
                  updateColorField(ci, "color", e.target.value)
                }
                className="w-full p-2 border rounded mb-2"
              />

              {/* Color Images */}
              <div className="mb-2">
                <h4 className="font-medium mb-1">Color Images</h4>
                {color.images.map((img, ii) => (
                  <div key={ii} className="flex gap-2 mb-1 items-center">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={img.url}
                      onChange={(e) =>
                        updateColorImage(ci, ii, "url", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Alt Text"
                      value={img.alt_text}
                      onChange={(e) =>
                        updateColorImage(ci, ii, "alt_text", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setPrimaryColorImage(ci, ii)}
                      className={`px-2 py-1 rounded text-white ${
                        img.is_primary ? "bg-green-600" : "bg-gray-400"
                      }`}
                    >
                      {img.is_primary ? "Primary" : "Set Primary"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeColorImage(ci, ii)}
                      className="px-2 py-1 rounded bg-red-600 text-white"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addColorImage(ci)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  + Add Color Image
                </button>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="font-medium mb-1">Sizes</h4>
                {color.sizes.map((size, si) => (
                  <div key={si} className="border p-2 mb-2 rounded">
                    <input
                      type="text"
                      placeholder="Size"
                      value={size.size}
                      onChange={(e) =>
                        updateSize(ci, si, "size", e.target.value)
                      }
                      className="w-full p-2 border rounded mb-1"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={size.price}
                      onChange={(e) =>
                        updateSize(ci, si, "price", e.target.value)
                      }
                      className="w-full p-2 border rounded mb-1"
                    />
                    <input
                      type="number"
                      placeholder="Sale Price"
                      value={size.sale_price}
                      onChange={(e) =>
                        updateSize(ci, si, "sale_price", e.target.value)
                      }
                      className="w-full p-2 border rounded mb-1"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={size.stock}
                      onChange={(e) =>
                        updateSize(ci, si, "stock", e.target.value)
                      }
                      className="w-full p-2 border rounded mb-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeSize(ci, si)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Remove Size
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSize(ci)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  + Add Size
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeColor(ci)}
                className="px-3 py-1 bg-red-700 text-white rounded mt-2"
              >
                Remove Color
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addColor}
            className="px-3 py-1 bg-blue-700 text-white rounded"
          >
            + Add Color
          </button>
        </div>

        <button type="submit" className="w-full p-3 bg-black text-white rounded">
          Update Product
        </button>
      </form>
    </div>
  );
}
