import React from 'react'
import Navbar from "./components/user/Navbar.jsx";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx";
import Product from "./pages/product.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
// import Footer from './components/user/footer.jsx';

function App() {

  return (
    <>
      <div className='min-h-screen flex flex-col'>
      <Navbar />
       <main >
      {/* // className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-8" */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product' element={<Product />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
        </main>
        {/* <Footer /> */}
      </div>
      
    </>
  )
}

export default App
