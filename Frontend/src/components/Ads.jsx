import React from "react";

const Ads = () => {
  return (
    <div className="relative w-full h-[400px]">
      <a href="#">
        <img
          src="https://img.freepik.com/free-photo/shopping-concept-close-up-portrait-young-beautiful-attractive-redhair-girl-smiling-looking-camera_1258-132679.jpg?t=st=1735491242~exp=1735494842~hmac=2dde971b2064d0ba41cda4c108e69793be0d21fad570f5c1669e3ff4bffc5cf3&w=900"
          alt="ads"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center bg-black bg-opacity-50">
          <div className="text-left pl-20">
            <h1 className="text-white text-4xl font-bold mb-2">
              Special Offer This Month
            </h1>
            <p className="text-white text-lg mb-4">
              Don’t miss out on this exclusive deal! We're offering huge discounts on all bumper models. Grab yours today and enjoy the savings!
            </p>
            <p className="text-white text-lg">
              Up to <span className="text-yellow-300 font-semibold">50% Off</span> on all items.
            </p>
          
          </div>
        </div>
      </a>
    </div>
  );
};

export default Ads;
