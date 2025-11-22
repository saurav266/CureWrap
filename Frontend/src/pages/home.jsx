import React from 'react'
import HeroSection from '../components/user/Hero.jsx'
import Framer from "../components/Framer.jsx";
import Features from "../components/Features";
import ShopActivity from "../components/ShopActivity";
const home = () => {
  return (
    <>
      
      <HeroSection />
      <Features />
      <Framer />
      <ShopActivity />
    </>
  )
}

export default home