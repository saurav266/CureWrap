import Navbar from "./user/Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
