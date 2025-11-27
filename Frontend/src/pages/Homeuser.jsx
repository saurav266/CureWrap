import React from 'react'
import HeroSection from '../components/user/Hero.jsx'
import Framer from "../components/Framer.jsx";
import Features from "../components/Features.jsx";
import ShopActivity from "../components/ShopActivity.jsx";
import PreHeadingGallery from '../components/user/PreFooter.jsx';
import FeaturedProducts from '../components/user/FeaturedProducts.jsx';
const Home = () => {
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

export default Home;