import React from 'react'
import{Routes,Route,BrowserRouter} from "react-router-dom";
import Footer from './components/Footer';
import Framer from './components/Framer';
import Features from './components/Features';
import ShopActivity from './components/ShopActivity';
function App() {

  return (
    <>
      <BrowserRouter>
      <Features />
      <Framer />
      <ShopActivity />
      <Footer />

      </BrowserRouter>
        
    </>
  )
}

export default App
