import { useState, useEffect } from "react";
import axios from "../utils/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    const res = await axios.get("/categories");
    setCategories(res.data);
  };

  const addCategory = async () => {
    await axios.post("/categories", { name });
    fetchCategories();
    setName("");
  };

  const deleteCategory = async (id) => {
    await axios.delete(`/categories/${id}`);
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold dark:text-white mb-4">
        Category Manager
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Category name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={addCategory}
        >
          + Add
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        {categories.map((c) => (
          <div key={c._id}
            className="flex justify-between border-b py-3"
          >
            <span className="dark:text-white">{c.name}</span>

            <button
              onClick={() => deleteCategory(c._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Categories;
