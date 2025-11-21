import React from 'react'
import{Routes,Route,BrowserRouter} from "react-router-dom";
import Footer from './components/Footer';
import Framer from './components/Framer';
import Features from './components/Features';
import ImageShop from './components/ImageShop';
import ShopActivity from './components/ShopActivity';
import Prefooter from './components/Prefooter';
function App() {

  return (
    <>
      <BrowserRouter>
      <Features />
      <Framer />
      <ShopActivity />
      <ImageShop />
      <Prefooter />
      <Footer />

      </BrowserRouter>
        
    </>
  )
}

export default App
