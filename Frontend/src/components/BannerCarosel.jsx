import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import axios from "axios";
import { Link } from "react-router-dom";

const BannerCarosel = () => {
  const [banners, setBanners] = useState([]);
  const responsive = {
    0: { items: 1 },
    568: { items: 1 },
    1024: { items: 1 },
  };

  // Fetch data from the backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/getoffers"
        );
        setBanners(response.data.homeOffer);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };
    fetchBanners();
  }, []);

  const items = banners.map((banner) => (
    <div
      key={banner.id}
      className="bg-cover bg-no-repeat bg-center py-20 md:py-40"
      style={{
        backgroundImage: `url("${banner.image}")`,
      }}
    >
      <div className="container mx-auto px-8 md:px-10">
        <h1
          className="text-4xl md:text-5xl text-center text-gray-100 font-semibold mb-4 capitalize"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
        >
          {banner.name}
        </h1>
        <p className="text-center text-red-600 text-xl font-semibold">
          {banner.offer}
        </p>
        <div className="mt-6 md:mt-12 text-center">
          <Link
            to={`/products/kids`}
            className="bg-red-600 border border-white text-white px-6 md:px-12 py-3 md:py-3 font-medium rounded-full hover:bg-transparent hover:text-primary"
          >
            {banner.buttonText || "Shop Now"}
          </Link>
        </div>
      </div>
    </div>
  ));

  return (
    <div>
      {/* Scrolling Offer Section */}
      <div className="relative text-red-800 bg-white overflow-hidden py-3">
        <div
          className="whitespace-nowrap flex items-center animate-scroll"
          style={{ animation: "scroll 15s linear infinite" }}
        >
          {banners.length > 0 && (
            <span className="mx-4 text-2xl font-semibold">
              {banners[0].offer}
            </span>
          )}
        </div>
      </div>

      {/* Carousel Section */}
      {banners.length > 0 ? (
        <AliceCarousel
          autoPlay
          autoPlayInterval={2000}
          animationDuration={2000}
          controlsStrategy="alternate"
          infinite
          responsive={responsive}
          disableButtonsControls
          disableDotsControls
          items={items}
        />
      ) : (
        <p className="text-center py-10">Loading banners...</p>
      )}
    </div>
  );
};

export default BannerCarosel;
