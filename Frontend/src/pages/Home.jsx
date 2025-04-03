import React from "react";
import Feature from "../components/Feature";
import Ads from "../components/Ads";
import BannerCarosel from "../components/BannerCarosel";
import Products from "./Products";

const Home = () => {
  return (
    <>
      <BannerCarosel />
      <Feature />
      <Products />
      <Ads />
    </>
  );
};

export default Home;
