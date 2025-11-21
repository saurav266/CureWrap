import React from 'react'
<<<<<<< HEAD
import Navbar from "./components/user/Navbar.jsx";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx";
import Product from "./pages/product.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
// import Footer from './components/user/footer.jsx';
import Login from "./pages/login.jsx";
import Register from './pages/register.jsx';

=======
import{Routes,Route,BrowserRouter} from "react-router-dom";
import Footer from './components/Footer';
import Features from './components/Features';
>>>>>>> crew
function App() {

  return (
    <>
<<<<<<< HEAD
      <div className='min-h-screen flex flex-col'>
      <Navbar />
       <main >
      {/* // className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-8" */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product' element={<Product />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
        </main>
        {/* <Footer /> */}
      </div>
      
=======
      <BrowserRouter>
      <Features />
      <Footer />

      </BrowserRouter>
        
>>>>>>> crew
    </>
  )
}

export default App
