import React from 'react'
import HeroSection from '../components/user/Hero.jsx'
import Framer from "../components/Framer.jsx";
import Features from "../components/Features";
import ShopActivity from "../components/ShopActivity";
import PreHeadingGallery from '../components/user/PreFooter.jsx';
import FeaturedProducts from '../components/user/FeaturedProducts.jsx';
const home = () => {
  return (
    <>
      
      <HeroSection />
      <Features />
      <FeaturedProducts />
      <Framer />
      <ShopActivity />
      <PreHeadingGallery />
    </>
  )
}

export default home