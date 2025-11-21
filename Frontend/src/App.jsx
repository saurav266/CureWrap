import React from 'react'
import{Routes,Route,BrowserRouter} from "react-router-dom";
import Footer from './components/Footer';
import Features from './components/Features';
function App() {

  return (
    <>
      <BrowserRouter>
      <Features />
      <Footer />

      </BrowserRouter>
        
    </>
  )
}

export default App
