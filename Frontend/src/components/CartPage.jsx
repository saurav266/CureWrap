// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import CartDrawer from "../components/CartDrawer";

export default function CartPage() {
  const [open, setOpen] = useState(true); // auto-open when route is hit

  // If you want open/close control from outside, you can pass props
  return (
    <div>
      <CartDrawer isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
