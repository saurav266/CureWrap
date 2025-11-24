import { useState } from "react";
import axios from "../utils/api";

const AddProduct = () => {
  const [data, setData] = useState({
    name: "",
    subtitle: "",
    sku: "",
    price: "",
    comparePrice: "",
    discount: "",
    stock: "",
    category: "",
    subcategory: "",
    sizes: "",
    colors: "",
    shortDesc: "",
    longDesc: "",
    metaTitle: "",
    metaDesc: "",
    metaKeywords: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const [features, setFeatures] = useState([""]);
  const [images, setImages] = useState([]);

  const handleChange = (key, value) => {
    setData({ ...data, [key]: value });

    if (key === "price" || key === "comparePrice") {
      const p = Number(key === "price" ? value : data.price);
      const cp = Number(key === "comparePrice" ? value : data.comparePrice);
      if (cp > p) {
        const d = Math.round(((cp - p) / cp) * 100);
        setData(prev => ({ ...prev, discount: d }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(data).forEach(key => form.append(key, data[key]));
    features.forEach(f => form.append("features[]", f));
    images.forEach(img => form.append("images", img));

    await axios.post("/products", form);
    alert("Product Added Successfully!");
  };

  return (
    <div className="p-6 dark:text-white">

      <h1 className="text-3xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* BASIC DETAILS */}
        <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Details</h2>

          <input type="text" className="input" placeholder="Product Name"
            onChange={e => handleChange("name", e.target.value)} />

          <input type="text" className="input" placeholder="Subtitle"
            onChange={e => handleChange("subtitle", e.target.value)} />

          <input type="text" className="input" placeholder="SKU"
            onChange={e => handleChange("sku", e.target.value)} />

          <div className="grid grid-cols-3 gap-4">
            <input type="number" className="input" placeholder="Price"
              onChange={e => handleChange("price", e.target.value)} />

            <input type="number" className="input" placeholder="Compare Price (MRP)"
              onChange={e => handleChange("comparePrice", e.target.value)} />

            <input type="number" className="input bg-gray-200 dark:bg-gray-700"
              value={data.discount} readOnly placeholder="Discount %" />
          </div>

          <input type="number" className="input" placeholder="Stock Quantity"
            onChange={e => handleChange("stock", e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" className="input" placeholder="Category"
              onChange={e => handleChange("category", e.target.value)} />

            <input type="text" className="input" placeholder="Sub-category"
              onChange={e => handleChange("subcategory", e.target.value)} />
          </div>
        </div>

        {/* VARIANTS */}
        <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Product Variants</h2>

          <input type="text" className="input" placeholder="Sizes (S, M, L)"
            onChange={e => handleChange("sizes", e.target.value)} />

          <input type="text" className="input" placeholder="Colors (Red, Blue)"
            onChange={e => handleChange("colors", e.target.value)} />
        </div>

        {/* IMAGES + PREVIEW */}
        <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>

          <input type="file" multiple
            onChange={(e) => setImages([...e.target.files])} />

          {/* Image Preview */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            {images.length > 0 &&
              Array.from(images).map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  className="w-full h-32 object-cover rounded-lg border"
                />
              ))
            }
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Description</h2>

          <textarea className="input h-24"
            placeholder="Short Description"
            onChange={e => handleChange("shortDesc", e.target.value)}
          />

          <textarea className="input h-40"
            placeholder="Long Description"
            onChange={e => handleChange("longDesc", e.target.value)}
          />

          {/* FEATURES */}
          <h3 className="font-semibold">Key Features</h3>
          {features.map((f, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                className="input"
                value={f}
                onChange={(e) =>
                  setFeatures(features.map((x, i) => (i === index ? e.target.value : x)))
                }
              />
              <button
                onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                className="px-3 py-1 bg-red-500 text-white rounded"
                type="button"
              >
                X
              </button>
            </div>
          ))}

          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            type="button"
            onClick={() => setFeatures([...features, ""])}
          >
            + Add Feature
          </button>
        </div>

        {/* SEO */}
        <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>

          <input className="input" placeholder="Meta Title"
            onChange={e => handleChange("metaTitle", e.target.value)} />

          <textarea className="input h-24" placeholder="Meta Description"
            onChange={e => handleChange("metaDesc", e.target.value)} />

          <input className="input" placeholder="Meta Keywords (comma separated)"
            onChange={e => handleChange("metaKeywords", e.target.value)} />
        </div>

        {/* SHIPPING INFO */}
        <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Info</h2>

          <input className="input" placeholder="Weight (grams)"
            onChange={e => handleChange("weight", e.target.value)} />

          <div className="grid grid-cols-3 gap-4">
            <input className="input" placeholder="Length"
              onChange={e => handleChange("length", e.target.value)} />
            <input className="input" placeholder="Width"
              onChange={e => handleChange("width", e.target.value)} />
            <input className="input" placeholder="Height"
              onChange={e => handleChange("height", e.target.value)} />
          </div>
        </div>

        {/* SUBMIT */}
        <button className="px-6 py-3 bg-green-600 text-white rounded text-lg">
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
