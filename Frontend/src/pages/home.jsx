import React from 'react'
import HeroSection from '../components/user/Hero.jsx'
import Framer from "../components/Framer.jsx";
import Features from "../components/Features";
import ShopActivity from "../components/ShopActivity";
import PreHeadingGallery from '../components/user/PreFooter.jsx';
const home = () => {
  return (
    <>
      
      <HeroSection />
      <Features />
      <Framer />
      <ShopActivity />
      <PreHeadingGallery />
    </>
  )
}

export default home