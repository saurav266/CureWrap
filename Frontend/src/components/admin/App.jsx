import { Routes, Route } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";

import Dashboard from "./admin/Dashboard";
import Products from "./admin/Products";
import AddProduct from "./admin/AddProduct";

function App() {
  return (
    <Routes>

      {/* ADMIN PANEL ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="add-product" element={<AddProduct />} />
      </Route>

    </Routes>
  );
}

export default App;
