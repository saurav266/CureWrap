import { useState, useEffect } from "react";
import axios from "../utils/api";

const SubCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    axios.get("/categories").then(res => setCategories(res.data));
    axios.get("/subcategories").then(res => setSubCategories(res.data));
  }, []);

  const addSub = async () => {
    await axios.post("/subcategories", {
      categoryId: selectedCategory,
      name,
    });

    const updated = await axios.get("/subcategories");
    setSubCategories(updated.data);
    setName("");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4 font-bold dark:text-white">
        Subcategory Manager
      </h1>

      <div className="flex gap-4 mb-6">
        <select
          className="input"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Subcategory name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={addSub}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          + Add
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        {subCategories.map((s) => (
          <div key={s._id} className="flex justify-between border-b py-3">
            <span>{s.name}</span>
            <span className="text-gray-400">{s.category?.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubCategories;
import { useState, useEffect } from "react";
import axios from "../utils/api";

const SubCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    axios.get("/categories").then(res => setCategories(res.data));
    axios.get("/subcategories").then(res => setSubCategories(res.data));
  }, []);

  const addSub = async () => {
    await axios.post("/subcategories", {
      categoryId: selectedCategory,
      name,
    });

    const updated = await axios.get("/subcategories");
    setSubCategories(updated.data);
    setName("");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4 font-bold dark:text-white">
        Subcategory Manager
      </h1>

      <div className="flex gap-4 mb-6">
        <select
          className="input"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Subcategory name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={addSub}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          + Add
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        {subCategories.map((s) => (
          <div key={s._id} className="flex justify-between border-b py-3">
            <span>{s.name}</span>
            <span className="text-gray-400">{s.category?.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubCategories;
