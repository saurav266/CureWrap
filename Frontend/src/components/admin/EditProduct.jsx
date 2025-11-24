import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/api";

const EditProduct = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get(`/products/${id}`).then(res => setData(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (let key in data) form.append(key, data[key]);
    images.forEach(i => form.append("images", i));

    await axios.put(`/products/${id}`, form);
    alert("Product Updated!");
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold dark:text-white mb-6">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 w-1/2">

        <input type="text" placeholder="Name"
          className="input" value={data.name || ""}
          onChange={e => setData({...data, name: e.target.value})} />

        <input type="number" placeholder="Price"
          className="input" value={data.price || ""}
          onChange={e => setData({...data, price: e.target.value})} />

        <input type="number" placeholder="Stock"
          className="input" value={data.stock || ""}
          onChange={e => setData({...data, stock: e.target.value})} />

        <input type="file" multiple
          onChange={(e) => setImages([...e.target.files])} />

        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Update
        </button>

      </form>
    </div>
  );
};

export default EditProduct;
